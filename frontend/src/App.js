import React, { useState, useEffect, useContext } from "react";
import Navbar from "./components/Navbar";
import HelperBar from "./components/HelperBar";
import RabbitHole from "./components/RabbitHole";
import Rabbit from "./components/Rabbit";
import BuildComponent from "./components/BuildComponent";
import AddControl from "./components/AddControl";
import eventEmitter from "./lib/event-emitter";

import "./index.scss";

import {
  Section,
  Container,
  Columns,
  Heading
} from "react-bulma-components/lib";
import { coordinator, endpoint } from "./coordinator";

export const MainContext = React.createContext({
  rabbitRun: null,
  changeRabbitRun: () => {}
});

export default props => {
  const [knownServices, setServices] = useState({});
  const [search, setSearch] = useState("");
  const [rabbitRun, setRabbitRun] = useState(false);

  const changeRabbitRun = () => {
    setRabbitRun(true);
  };

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

  return (
    <div>
      <MainContext.Provider
        value={{
          changeRabbitRun: changeRabbitRun,
          rabbitRun: rabbitRun
        }}
      >
        <Navbar onSearch={newSearch => setSearch(newSearch)} />
        <Rabbit />
        <RabbitHole />
        <Section>
          <Container>
            <AddControl />
          </Container>
        </Section>
        <Section>
          <Container>
            <Columns>
              {Object.keys(knownServices).map(k => (
                <Columns.Column size="half" key={k}>
                  <Heading>{k}</Heading>
                  <BuildComponent tag={k} search={search} />
                </Columns.Column>
              ))}
            </Columns>
          </Container>
        </Section>
        <HelperBar services={knownServices} />
      </MainContext.Provider>
    </div>
  );
};

/*

 */
