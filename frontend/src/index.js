import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Router } from "@reach/router";
import RabbitHolePage from "./pages/RabbitHole/Page";
import * as serviceWorker from "./serviceWorker";

export const githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;

ReactDOM.render(
  <Router>
    <RabbitHolePage path="/rabbithole" />
    <App path="/*" />
  </Router>,
  document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
