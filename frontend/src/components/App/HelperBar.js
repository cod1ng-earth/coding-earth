import React from "react";
import { Box, Button, Text } from 'grommet'
import RabbitHole from "../../pages/RabbitHole/RabbitHole";
import Rabbit from "../../pages/RabbitHole/Rabbit";
import PartialNavLink from '../PartialNavLink'

export default (props) => (
    <Box flex={false} justify="between" >
        <Box justify="between" direction="row" background="dark-1">
            <Box direction="row">
                {Object.keys(props.services).map(k =>
                    (
                        <Button as={PartialNavLink} to={`/${k}`} hoverIndicator={true} fill="vertical" key={`link-${k}`}>
                            <Box align="center" pad={{ "horizontal": "medium", "vertical": "small" }} direction="row" gap="small">
                                <Text size="large" weight="bold">
                                    {k}
                                </Text>
                            </Box>
                        </Button>
                    )
                )}

            </Box>
            <Box style={{ position: 'relative' }}>
                <Rabbit running={props.running} />
                <RabbitHole />
            </Box>
        </Box>
    </Box>
)