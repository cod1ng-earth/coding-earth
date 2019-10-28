import React, { useState, useEffect } from "react";
import { Box, Button, Image, Paragraph, Text } from 'grommet'
import RabbitHole from "../pages/RabbitHole/RabbitHole";
import Rabbit from "../pages/RabbitHole/Rabbit";
import eventEmitter from "../lib/event-emitter";

export default class HelperBar extends React.Component {
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
                    <Box style={{ position: 'relative' }}>
                        <Rabbit running={this.props.running} />
                        <RabbitHole />
                    </Box>
                </Box>
            </Box>
        )
    }
}