import React, { useState, useEffect } from "react";
import eventEmitter from "./lib/event-emitter";
import { ReactComponent as Fortuneteller } from "./images/fortuneteller.svg";
import { ReactComponent as Funghi } from "./images/funghi1.svg";
import { ReactComponent as Funghi2 } from "./images/funghi2.svg";
import { ReactComponent as Card } from "./images/card.svg";
import { ReactComponent as Watch } from "./images/watch.svg";

import { coordinator, endpoint } from "./coordinator";

export default props => {
  const [knownServices, setServices] = useState({});

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
      console.log("Welcome to rabbit hole");
      console.log(message);
      eventEmitter.emit(`content-${message.type}`, message);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#310f3f",
        height: "100%",
        minHeight: "500px",
        color: "#FFF",
        padding: "20px"
      }}
    >
      <Fortuneteller />
      <Funghi />
      <Funghi2 />
      <Card />
      <Watch />
    </div>
  );
};
