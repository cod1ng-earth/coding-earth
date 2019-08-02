# Frontend development
For the "scaffold" we decided to go with React based frontend because... React. It's based on Create React App so you can build and start it locally using `yarn run start`. If you never used it before, we've left their original README below.

If you simply want to work on the frontend and do not care about how the microservices work but directly want to connect your current platform.sh's environment, simply create a  copy the `scaffold/.env.dist` file to a `.env` file and change the `REACT_APP_COORDINATOR` to your current environment's coordinator URL. You can also simply connect it to the production application: `REACT_APP_COORDINATOR=https://coordinator.devday.tk` 

If you're running this as part of the full Docker setup,`yarn run start` is called in dev mode behind the scenes upon the container startup, including full HMR capabilities. 

## The flow of data
The first thing the application does, is getting routes from the configured coordinator (see `src/coordinator.js`).

```js
import axios from 'axios'

const endpoint = process.env.REACT_APP_COORDINATOR ||
"//coordinator." + window.location.host

const promise = axios.get(endpoint)
export default promise;
```

A typical coordinator response looks like
```json
{
    "calendar": {
        "endpoint":"https://calendar.coding.earth/",
        "original_url":"https://calendar.{default}/"
    }
}
```

Once the coordinator service did respond the application iterates over all service definitions and renders a `BuildComponent` for it. That one tries to find a dedicated frontend component for the service. If it can't find any it falls back to a display of the service's JSON response.

The dedicated components receive the service's URL as property that's used by the common `src/componentData.js` helper to load API data from the service. Each component then is responsible for making sense of the data.

# Troubleshooting
## the frontend looks so empty.
maybe your coordinator isn't configured correctly? check `coordinator/.env`'s DEFAULT_HOST. If your local setup runs on `devday.local:8000` it also should point to  `devday.local:8000`. You can call `make coordinator` to recreate the env file and its decoded contents. 

# the original CRA README
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn run start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
