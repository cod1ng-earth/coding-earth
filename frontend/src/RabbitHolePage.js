import React, { useState, useEffect } from "react";
import eventEmitter from "./lib/event-emitter";
import { ReactComponent as Fortuneteller } from "./images/fortuneteller.svg";
import { ReactComponent as Funghi } from "./images/funghi1.svg";
import { ReactComponent as Funghi2 } from "./images/funghi2.svg";
import { ReactComponent as Card } from "./images/card.svg";
import { ReactComponent as Watch } from "./images/watch.svg";
import { ReactComponent as Rabbit } from "./images/hasi-holesite.svg";

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
        minHeight: "1550px",
        color: "#FFF",
        padding: "20px"
      }}
    >

    <div
    style={{
        margin:"0 auto"
    }}
    ><p style={{


    }}>
    WELCOME TO THE RABBIT HOLE
    </p>
    </div>

    <a href=""><div
      style={{
        width:"20%",
        margin:"0 auto"
      }}
    >
      <Fortuneteller />
      </div></a>

      <div
        style={{
          position:"absolute",
          width:"220px",
          right:"-70px"


        }}
      >
        <Funghi />
        </div>

        <div
          style={{
            position:"absolute",
            width:"250px",
            left:"-70px"


          }}
        >
          <Funghi2 />
          </div>

          <div
            style={{
              position:"absolute",
              width:"250px",
              right:"-70px",
              top: "800px"


            }}
          >
              <Card />
            </div>

            <div
              style={{
                position:"absolute",
                width:"450px",
                left:"270px",
                top: "800px"


              }}
            >
              <Watch />
              </div>

              <div
                style={{
                  position:"absolute",
                  width:"150px",
                  left:"-30px",
                  top: "1300px"


                }}
              >
                <Rabbit />
                </div>








    </div>

  );


};
