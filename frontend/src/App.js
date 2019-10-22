import React, { useState, useEffect } from "react";
import { grommet, Grommet, Box, Heading, Grid } from 'grommet'

import AppHeader from './components/AppHeader'
import HelperBar from "./components/HelperBar";

import BuildComponent from "./components/BuildComponent";
import Sidebar from './components/Sidebar';


import eventEmitter from "./lib/event-emitter";

import { coordinator, endpoint } from "./coordinator";
import { Router } from "@reach/router";

const Home = () => (<div>home</div>)

export default props => {
  const [knownServices, setServices] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      const routes = await coordinator;
      setServices(routes.data);
    }
    fetchData();

    const eventSource = new EventSource(`${endpoint}/events`);
    eventSource.onmessage = msg => {
      if ("ping" === msg.data) return false;

      const message = JSON.parse(msg.data);
      eventEmitter.emit(`content-${message.type}`, message);
    };
  }, []);

  return <Grommet theme={grommet} full>
    <AppHeader onSearch={newSearch => setSearch(newSearch)} />
    <Box direction="row" >
      <Sidebar services={knownServices} />
      <Box margin="small" fill>
        <Router>
          <Home path="/" />

          <BuildComponent path={`/:component`} search={search} />

        </Router>
      </Box>

    </Box>
    <HelperBar services={knownServices} />
  </Grommet>

};