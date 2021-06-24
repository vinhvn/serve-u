<img src="./docs/serve-u-banner.png" width="1024px">

An easy-to-use private asset repository to allow authorized users to upload and serve static files. In short, it's a personal and private clone of [imgur](https://imgur.com).

## 🔍 Preview

![Preview](docs/serve-u-preview.gif)

## 🕹️ Demo

Feel free to try out **ServeU** at [serveu.vincentnguyen.ca](https://serveu.vincentnguyen.ca).

The password to the demo account is `demo`. Any files uploaded to the demo repository will be removed from the database and deleted after approximately 1 hour.

## 🚀 Features

**ServeU** is a platform where authorized users can upload and share files with their colleagues, friends, and anyone else with a link.

Supported features include:

- Randomized and adorable animal-based file IDs thanks to [randimals](https://github.com/vinhvn/randimals)
- A simple sign in using a password tied to a personal account and repository
- Upload images, audio, video, and any other files (NOTE: only image, audio, and video previews are supported)
- Get a shareable link to the asset to send to colleagues and friends
- Users may only see files that they have uploaded themselves

NOTE: Registration for users is currently only possible through the host or administrator.

## 🔧 Setup

### 💻 Client

To set up the client, navigate to the `client` folder and open `.env.example` to configure options:

```sh
REACT_APP_API_URL=http://localhost:3001
```

`API_URL` here refers to the location where the server is hosted. If working locally, no changes need to be made but for production, this should be changed to the domain and port where the server is hosted. When your changes are done, rename `.env.example` to `.env` to allow the project to use it.

Afterwards, install [yarn](https://yarnpkg.com) and run the following two commands to get started:

```sh
yarn install
yarn dev
```

For additional commands and information, please refer to the client [README](client/README.md).

### 🌐 Server

To set up the server, navigate to the `server` folder and open `.env.example` to configure options:

```sh
PORT=3001
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
DEMO_USERNAME=demo
DEMO_PASSWORD=demo
API_KEY=someLongAndComplexStringOfCharacters
API_URL=http://localhost:3001
APP_URL=http://localhost:3000
```

`API_URL` and `APP_URL` refers to the locations where the server and app are located, respectively. If working locally, no changes need to be made but for production, these should be changed to the domain(s) and ports where the two will be hosted. When your changes are done, rename `.env.example` to `.env` to allow the project to use it.

Afterwards, install [yarn](https://yarnpkg.com) and run the following two commands to get started:

```sh
yarn install
yarn dev
```

## License

Under the MIT License.
