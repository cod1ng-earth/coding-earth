import React, { useState, useEffect } from "react";
import {Box, Button, Image, Paragraph, Text} from 'grommet'
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
        return (
        <Box justify="between" >
            <Box justify="between" direction="row" background="dark-1">
                <Box direction="row">
                    <Button onClick={this.run} label="run" />
                    {Object.keys(this.props.services).map(k =>
                        (
                            <Button hoverIndicator={true} href="#" fill="vertical">
                                <Box align="center" justify="center" pad={{ "vertical": "small", "horizontal": "medium" }} direction="row" gap="small" fill="vertical">
                                    <Text weight="bold" size="large">
                                        {k}
                                    </Text>
                                </Box>
                            </Button>
                        )
                    )}

                </Box>
                <Box style={{position: 'relative'}}>
                    <Rabbit running={this.state.running} />
                    <RabbitHole />
                </Box>
            </Box>
        </Box>
        )
    }
}