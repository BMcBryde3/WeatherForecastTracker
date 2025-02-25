import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import { fileURLToPath } from 'url';

// Import the routes
import routes from './routes/index.js';
import path from 'path';

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.static('../client/dist'));

//sets file path for ./db/searchHistory.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/searchHistory', express.static(path.join(__dirname, '../db/searchHistory.json')));




// TODO: Implement middleware for parsing JSON and 
app.use(express.json());
//urlencoded form data
app.use(express.urlencoded({ extended: true }));
// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
