/**
 * ServeU Server
 * index.ts
 * Written by Vincent Nguyen
 */

/**
 * imports
 */
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import randimals from 'randimals/dist';
import fs from 'fs';
import cors from 'cors';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

/**
 * custom types
 */
type DatabaseFile = {
  id: string;
  filename: string;
  username: string;
  type: string;
  mimetype: string;
};
type DatabaseData = {
  files: DatabaseFile[];
};

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
// database setup to keep track of links
const adapter = new FileSync<DatabaseData>(
  path.join(__dirname, 'data', 'db.json')
);
const db = low(adapter);
db.defaults({ files: [] }).write();

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
app.use(cors());

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
  // if api key is incorrect or no username is provided, redirect
  if (req.header('Api-Key') !== API_KEY) {
    res.sendStatus(401);
  } else if (!req.header('Username')) {
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

// resource not found
app.get('/404', (_, res) => {
  res.sendStatus(404);
});

// route for app to get resource
app.get('/asset/:id', (req, res) => {
  const search = db.get('files').find({ id: req.params.id }).value();
  if (!search) {
    res.redirect('/404');
    return;
  }
  const { filename, username, type } = search;
  const url = `${API_URL}${
    username === ADMIN_USERNAME ? '' : `/${username}`
  }/${filename}`;
  const pkg = {
    url,
    type,
  };
  res.status(200).send(pkg);
});

// route for app to get files under a certain user
app.get('/list/:user', (req, res) => {
  const username = req.header('Username');
  const search = db.get('files').filter({ username }).value();
  if (!search) {
    res.redirect('/404');
    return;
  }
  const pkg = {
    files: search.map((entry) => ({ id: entry.id, type: entry.type })),
  };
  res.status(200).send(pkg);
});

// redirect to app to display asset
app.get('/:id', (req, res) => {
  res.redirect(`${APP_URL}/${req.params.id}`);
});

app.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  const username = req.header('Username');
  const { filename, mimetype } = req.file;
  console.log(`[SERVER]: successfully uploaded file @ ${API_URL}/${filename}`);
  // update database
  const id = filename.slice(0, filename.indexOf('.'));
  db.get('files')
    .push({
      id,
      filename,
      username,
      type: mimetype.slice(0, mimetype.indexOf('/')),
      mimetype,
    })
    .write();
  res.status(201).send(id);
});

app.post('/login', (req, res) => {
  const { password } = req.body;
  // no password given
  if (!password) {
    res.sendStatus(401);
    return;
  }

  const pkg = {
    apiKey: API_KEY,
    username: '',
  };

  if (password === ADMIN_PASSWORD) {
    pkg.username = 'admin';
  } else if (password === DEMO_PASSWORD) {
    pkg.username = 'demo';
  } else {
    // incorrect password
    res.sendStatus(401);
    return;
  }
  res.status(200).send(JSON.stringify(pkg));
});

// catch all other requests as 404s and redirect them to the app
app.all('*', (req, res) => {
  res.redirect(`${APP_URL}${req.url}`);
});

// start the express server
app.listen(PORT, () => {
  console.log(`[SERVER]: started at ${API_URL}`);
});
