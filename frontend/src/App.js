import React, { useState, useEffect } from "react";
import { grommet, Grommet, Box, Layer, Collapsible, Heading, Grid } from 'grommet'

import AppHeader from './components/App/AppHeader'
import HelperBar from "./components/App/HelperBar";

import BuildComponent from "./components/BuildComponent";
import Sidebar from './components/App/Sidebar';

import eventEmitter from "./lib/event-emitter";

import { coordinator, endpoint } from "./coordinator";
import { Router } from "@reach/router";

const Home = () => (<div>home</div>)

export default props => {
  const [knownServices, setServices] = useState({});
  const [search, setSearch] = useState("");
  const [running, setRunning] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    (async function fetchData() {
      const routes = await coordinator;
      setServices(routes.data);
    })()

    const eventSource = new EventSource(`${endpoint}/events`);
    eventSource.onmessage = msg => {
      if ("ping" === msg.data) return false;

      const message = JSON.parse(msg.data);
      eventEmitter.emit(`content-${message.type}`, message);
    };
  }, []);

  const startRunning = (url) => {
    setRunning(true)
    setTimeout(() => setRunning(false), 8000);
  }

  return <Grommet theme={grommet} full>

    <Box fill>
      <AppHeader onSearch={newSearch => setSearch(newSearch)}
        toggleSidebar={() => setSidebar(!sidebar)}
        onSubmitted={
          (url) => startRunning(url)
        } />

      <Box direction="row" flex overflow="auto">
        {sidebar && <Layer full="vertical" position="left" plain={true}
          onClickOutside={() => setSidebar(false)}>
          <Sidebar services={knownServices} />
        </Layer>
        }
        <Box margin="small" fill>
          <Router>
            <Home path="/" />

            <BuildComponent path={`/:component`} search={search} />

          </Router>
        </Box>
      </Box>

      <HelperBar services={knownServices} running={running} />
    </Box>
  </Grommet>

};