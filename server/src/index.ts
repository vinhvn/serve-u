// index.ts

/**
 * imports
 */
import express from 'express';
import path from 'path';
import dotenv from 'dotenv'
import multer from 'multer';
import { v4 as uuid } from 'uuid'

/**
 * general setup and configuration
 */
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;
const API_URL = process.env.API_URL;
const APP_URL = process.env.APP_URL;
const API_KEY = process.env.API_KEY;
// get our local storage up and running
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'static'),
  filename: (_, file, cb) => {
    cb(null, uuid() + path.extname(file.originalname));
  },
})
const upload = multer({ storage });

/**
 * express middleware
 */
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'static')));
// allow CORS in our app
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * routes and handlers
 */
app.get('/', (_, res) => {
  res.redirect(APP_URL);
});
app.post('/upload', authenticate, upload.single('file'), (req, res) => {
  console.log(`[SERVER]: successfully uploaded file @ ${API_URL}/${req.file.filename}`)
  res.status(201).send(`${APP_URL}/${req.file.filename}`);
});
// catch all other requests as 404s and redirect them to the app
app.all('*', (req, res) => {
  res.redirect(`${APP_URL}${req.url}`);
});

// start the express server
app.listen(PORT, () => {
  console.log(`[SERVER]: started at ${NODE_ENV === 'development' ? `http://localhost:${PORT}` : API_URL}`);
});

/**
 * the authenticate function is an express middleware used to check for a matching API key
 */
 function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  // if api key is incorrect, redirect
  if (req.header('Api-Key') !== API_KEY) {
    res.sendStatus(401);
  } else {
    next();
  }
}
