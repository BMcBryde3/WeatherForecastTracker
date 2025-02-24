import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather implements Coordinates {
  city: string;
  date: string;
  lat: number;
  lon: number;
  tempF: number;
  humidity: number;
  windSpeed: number;
  iconDescription: string;
  icon: string;

  constructor(city: string, date: string, lat: number, lon: number, tempF: number, humidity: number, windSpeed: number, iconDescription: string, icon: string) {
    this.city = city;
    this.date = date;
    this.lat = lat;
    this.lon = lon;
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.iconDescription = iconDescription;
    this.icon = icon;
  }
}


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the environment baseURL, environment API key, and city name properties
  private baseURL = process.env.API_BASE_URL;
  private apiKey = process.env.API_KEY;
  public cityName: string = '';
  
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    // console.log('Query:', query); // Add logging
    try {
      const response = await fetch(query);
      const responseText = await response.text();
  
      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }
  
      try {
        const locationData = JSON.parse(responseText);
        // console.log('Location data:', locationData); // Add logging
        return locationData;
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Unable to parse location data');
      }
    } catch (error) {
      console.error('Error in fetchLocationData:', error);
      throw new Error('Unable to retrieve location data');
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    locationData = locationData[0];
    const coordinates = {
      lat: locationData.lat,
      lon: locationData.lon
    };
    return coordinates;
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(cityName:string): string {
    cityName = encodeURIComponent(cityName);
    const query = `${this.baseURL}/geo/1.0/direct?q=${cityName}&appid=${this.apiKey}&limit=1`;
    return query;

  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const query = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial&cnt=5`;
    return query;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(cityName: string) {
    const query = this.buildGeocodeQuery(cityName);
    const locationData = await this.fetchLocationData(query);
    const coordinates = this.destructureLocationData(locationData);
    return coordinates;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    // console.log('Weather Query:', query); // Add logging
    const response = await fetch(query);
    const responseText = await response.text();
    // console.log('Weather Response:', responseText); // Add logging
  
    if (!response.ok) {
      throw new Error('Unable to retrieve weather data');
    }
  
    try {
      const weatherData = JSON.parse(responseText);
      // console.log('Weather data:', weatherData); // Add logging
      return weatherData;
    } catch (parseError) {
      console.error('Error parsing weather JSON:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Unable to parse weather data');
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    if (!response || !response.list || !response.list[0]) {
      console.error('Invalid weather data:', response);
      throw new Error('Invalid weather data');
    }
  
    const currentWeatherResponse = response.list[0];
  
    const currentWeather = new Weather(
      response.city.name,
      new Date().toISOString(), // Add the current date
      response.city.coord.lat,
      response.city.coord.lon,
      currentWeatherResponse.main.temp,
      currentWeatherResponse.main.humidity,
      currentWeatherResponse.wind.speed,
      currentWeatherResponse.weather[0].description,
      currentWeatherResponse.weather[0].icon
    );
  
    // console.log('Current Weather:', currentWeather); // Add logging
    return currentWeather;
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any): any[] {
    if (!weatherData || !weatherData.list) {
      console.error('Invalid weather data:', weatherData);
      throw new Error('Invalid weather data');
    }
  
    const specificWeatherData = weatherData.list.map((day: any) => {
      console.log('Day Data:', day); // Add logging
      if (!day.main || !day.weather || !day.weather[0]) {
        console.error('Invalid day data:', day);
        throw new Error('Invalid day data');
      }
  
      return new Weather(
        weatherData.city.name,
        new Date(day.dt_txt).toISOString(), // Add the date from the weather data
        weatherData.city.coord.lat,
        weatherData.city.coord.lon,
        day.main.temp,
        day.main.humidity,
        day.wind.speed,
        day.weather[0].description,
        day.weather[0].icon
      );
    });
  
    // console.log('Filtered Weather Data:', specificWeatherData); // Add logging
    return specificWeatherData;
  }
  // TODO: Complete getWeatherForCity method
  public async getWeatherForCity(cityName: string): Promise<{ currentWeather: Weather, forecastArray: any[] }> {
    try {
      this.cityName = cityName; // Ensure cityName is set
      const coordinates = await this.fetchAndDestructureLocationData(cityName);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastArray = this.buildForecastArray(weatherData);
      console.log('Current Weather:', currentWeather); // Add logging
      console.log('Forecast Array:', forecastArray); // Add logging
      return { currentWeather, forecastArray };
    } catch (error) {
      console.error('Error in getWeatherForCity:', error);
      throw new Error('Unable to get weather for city');
    }
  }
}

export default new WeatherService();


