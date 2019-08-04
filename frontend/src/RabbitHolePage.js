import React, { useState, useEffect } from "react";
import eventEmitter from "./lib/event-emitter";
import { ReactComponent as Fortuneteller } from "./images/fortuneteller.svg";
import { ReactComponent as Funghi } from "./images/funghi1.svg";
import { ReactComponent as Funghi2 } from "./images/funghi2.svg";
import { ReactComponent as Card } from "./images/card.svg";
import { ReactComponent as Watch } from "./images/watch.svg";

import { coordinator, endpoint } from "./coordinator";

const CarrotBin = props => {
  console.log(props.carrots);
  const carrots = props.carrots.map(carrot => {
    return (
      <li class="carrot" key={carrot.url} style={{ padding: "40px" }}>
        <a href="{carrot.url}" target="_blank">
          <img
            style={{ backgroundColor: "#fff", borderRadius: "50%" }}
            src={carrot.favicon}
          />
        </a>
      </li>
    );
  });
  return <ul>{carrots}</ul>;
};

export default class RabbitHolePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      carrots: []
    };
  }

  componentDidMount() {
    const eventSource = new EventSource(`${endpoint}/events`);
    eventSource.onmessage = msg => {
      if ("ping" === msg.data) return false;

      const carrot = JSON.parse(msg.data);

      let carrots = this.state.carrots;
      carrots.push(carrot);
      this.setState({ carrots: carrots });
    };
  }

  render() {
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
        <CarrotBin carrots={this.state.carrots} />
        <Fortuneteller />
        <Funghi />
        <Funghi2 />
        <Card />
        <Watch />
      </div>
    );
  }
}
