import React, { useState, useEffect } from "react";

import { Grommet, Box, Button, Layer, Text } from 'grommet'
import theme from './theme.json';

import AppHeader from './components/App/AppHeader'
import HelperBar from "./components/App/HelperBar";

import BuildComponent from "./components/BuildComponent";
import Sidebar from './components/App/Sidebar';

import { coordinator } from "./coordinator";
import { Router } from "@reach/router"
import { Provider as NotificationsProvider } from './store/Notifications'
import Notifications from './components/Notifications'
import { EventProvider } from './store/EventSource'

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

  }, []);

  const startRunning = (url) => {
    setRunning(true)
    setTimeout(() => setRunning(false), 8000);
  }


  return <Grommet theme={theme} full>
    <NotificationsProvider>
      <Box fill>


        <EventProvider />
        <AppHeader onSearch={newSearch => setSearch(newSearch)}
          toggleSidebar={() => setSidebar(!sidebar)}
          onSubmitted={
            (url) => startRunning(url)
          } />

        <Notifications></Notifications>
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

    </NotificationsProvider>
  </Grommet>

};