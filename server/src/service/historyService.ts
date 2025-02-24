import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// TODO: Define a City class with name and id properties
class City{

  name: string;
  id: string = Math.random().toString(36).substr(2, 9);

  constructor(name: string){
    this.name = name;

  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.filePath = path.join(__dirname, '../../db/searchHistory.json');
  }
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading searchHistory.json file', error);
      throw error;
    }
  }
//   // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
private async write(cities: City[]): Promise<void> {
  try {
    await fs.writeFile(this.filePath, JSON.stringify(cities));
  } catch (err) {
    console.error('Error writing searchHistory.json file', err);
  }
}
//   // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
public async getCities(): Promise<City[]> {
  const cities = await this.read();
  return cities;
}
//   // TODO Define an addCity method that adds a city to the searchHistory.json file
public async addCity(city: string): Promise<void> {
  const cities = await this.getCities();
  const newCity = new City(city);
  cities.push(newCity);
  await this.write(cities);
}

  
//   // // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
public async removeCity(id: string): Promise<void> {
  const cities = await this.getCities();
  const updatedCities = cities.filter((city: City) => city.id !== id);
  await this.write(updatedCities);
}
}

export default new HistoryService();
