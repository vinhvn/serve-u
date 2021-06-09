// index.ts

/**
 * imports
 */
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import randimals from 'randimals/dist';
import fs from 'fs';

/**
 * general setup and configuration
 */
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const DEMO_PASSWORD = process.env.DEMO_PASSWORD;
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;
const APP_URL = process.env.APP_URL;

// get our local storage up and running
const storage = multer.diskStorage({
  destination: (req, _, cb) => {
    // get username and make directory
    const username = req.header('Username');
    // if admin, place in `/`
    if (username === ADMIN_USERNAME) {
      return cb(null, path.join(__dirname, 'data'));
    }

    const filePath = path.join(__dirname, 'data', username);
    try {
      fs.mkdirSync(filePath, { recursive: true });
    } catch (e) {
      // in case directory already exists
      if (e.code !== 'EEXIST') {
        throw e;
      }
    }

    cb(null, filePath);
  },
  filename: (_, file, cb) => {
    cb(
      null,
      randimals({ adjectives: 2, format: 'pascal' }) +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

/**
 * express middleware
 */
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'data')));
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

/**
 * the authenticate function is an express middleware used to check for a matching API key
 * @param req   {Object} request
 * @param res   {Object} response
 * @param next  {Function} callback function
 */
function authenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // if api key is incorrect, redirect
  if (req.header('Api-Key') !== API_KEY) {
    res.sendStatus(401);
  } else {
    next();
  }
}

/**
 * routes and handlers
 */
app.get('/', (_, res) => {
  res.redirect(APP_URL);
});

app.post('/upload', authenticate, upload.single('file'), (req, res) => {
  console.log(
    `[SERVER]: successfully uploaded file @ ${API_URL}/${req.file.filename}`
  );
  res.status(201).send(`${API_URL}/${req.file.filename}`);
});

app.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.sendStatus(401);
  }

  if (password === ADMIN_PASSWORD) {
    res.status(200).send('admin');
  } else if (password === DEMO_PASSWORD) {
    res.status(200).send('demo');
  } else {
    res.sendStatus(401);
  }
});
// catch all other requests as 404s and redirect them to the app
app.all('*', (req, res) => {
  res.redirect(`${APP_URL}${req.url}`);
});

// start the express server
app.listen(PORT, () => {
  console.log(`[SERVER]: started at ${API_URL}`);
});
