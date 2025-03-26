import { fileURLToPath } from 'url';
import cors from 'cors';
import path from 'path';
import express from 'express';
//import Game from './game.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
const publicFolder = path.join(__dirname, '/public');
app.use(express.static(publicFolder));

//const game = Game();

// Implement your endpoints here...


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});
