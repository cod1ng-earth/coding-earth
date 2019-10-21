import React from "react";
import { Router } from "@reach/router";
import App from "./App";
import RabbitHolePage from "./components/RabbitHole/Page";

const Routes = () => (
  <Router>
    <App path="/" />
    <RabbitHolePage path="/rabbithole"  />
  </Router>
);

export default Routes;
