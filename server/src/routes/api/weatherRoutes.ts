import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

router.post('/', async (req: Request, res: Response) => {
  try {
    const cityName = req.body.cityName;
    console.log('City Name:', cityName);

    // GET weather data from city name
    const data = await WeatherService.getWeatherForCity(cityName);
    console.log('Weather Data:', data);

    if (!data || !data.currentWeather || !data.forecastArray) {
      throw new Error('Invalid weather data received');
    }

    const weatherData = [data.currentWeather, ...data.forecastArray];
    await HistoryService.addCity(cityName);
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Unable to retrieve weather data' });
  }
  

});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Unable to retrieve search history' });
  }
});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, res: Response) => {

  const id = _req.params.id;
  await HistoryService.removeCity(id);
  res.status(204).send();
  
});

export default router;
