import React, { useState, useEffect } from "react";
import {Navbar, Button} from 'react-bulma-components/lib';
import RabbitHole from "./RabbitHole/RabbitHole";
import Rabbit from "./RabbitHole/Rabbit";
import eventEmitter from "../lib/event-emitter";

export default class HelperBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {running: false}
        this.run = this.run.bind(this)
    }

    run(message) {
        this.setState({running: true})
        setTimeout(() => this.setState({running: false}), 8000);
    }

    componentDidMount() {
        eventEmitter.on('content-tweet', message => {
            this.run(message)
        });
    }

    render() {
        return <Navbar
            color="black"
            fixed="bottom"
        >
            <Rabbit running={this.state.running} />
            <RabbitHole />

            <Navbar.Menu>
                <Navbar.Container>
                    <Button onClick={this.run}>run</Button>
                    {Object.keys(this.props.services).map(k =>
                        <Navbar.Item href="#" key={k}>{k}</Navbar.Item>
                    )}
                </Navbar.Container>
            </Navbar.Menu>
        </Navbar>
    }

}