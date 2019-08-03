import React, { useState, useEffect } from "react";
import eventEmitter from "./lib/event-emitter";

import { coordinator, endpoint } from "./coordinator";

export default props => {
  const [knownServices, setServices] = useState({});

  useEffect(() => {
    async function fetchData() {
      const routes = await coordinator;
      console.log(routes.data);
      setServices(routes.data);
    }
    fetchData();

    const eventSource = new EventSource(`${endpoint}/events`);
    eventSource.onmessage = msg => {
      if ("ping" === msg.data) return false;

      const message = JSON.parse(msg.data);
      console.log("Welcome to rabbit hole");
      console.log(message);
      eventEmitter.emit(`content-${message.type}`, message);
    };
  }, []);

  return <div>Rabbit hole</div>;
};
