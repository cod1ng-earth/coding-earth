import React from 'react'
import { Box, Grid, Button, Text, Menu } from 'grommet'
import PartialNavLink from '../PartialNavLink'

export default ({ services }) => {
    const nav = Object.keys(services).map(k => (
        <Button as={PartialNavLink} to={`/${k}`} hoverIndicator={true} fill="vertical" key={`link-${k}`}>
            <Box align="center" pad={{ "horizontal": "medium", "vertical": "small" }} direction="row" gap="small">
                <Text size="large" weight="bold">
                    {k}
                </Text>
            </Box>
        </Button>
    ))

    return <Box justify="between" background="dark-1" fill="vertical">
        <Box>
            {nav}
        </Box>
    </Box>


}
