import React, { useState, useEffect } from "react";
import { grommet, Grommet, Box, Heading, Grid } from 'grommet'

import AppHeader from './components/AppHeader'
import HelperBar from "./components/HelperBar";

import BuildComponent from "./components/BuildComponent";
import Sidebar from './components/Sidebar';


import eventEmitter from "./lib/event-emitter";

import {coordinator, endpoint} from "./coordinator";

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

  return <Grommet theme={grommet}>
        <AppHeader onSearch={newSearch => setSearch(newSearch)} />
        <Box direction="row" >
          <Sidebar />
          <Box margin="small" fill>
            {Object.keys(knownServices).map(k => (
                <Box key={k}>
                  <Heading margin={{vertical: "medium"}}>{k}</Heading>
                  <BuildComponent tag={k} search={search} />
                </Box>
            ))}
          </Box>

        </Box>
    <HelperBar  services={knownServices} />
      </Grommet>

};
