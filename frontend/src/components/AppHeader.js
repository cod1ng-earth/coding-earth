import React from 'react'
import { Link } from '@reach/router'
import { Box, Button, Text } from 'grommet'
import { Globe } from 'grommet-icons'
import AddControl from './AddControl'

export default () => (

    <Box justify="between" direction="row" background="dark-3">

        <Button as={Link} to="/" hoverIndicator={true} fill="vertical">
            <Box align="center" justify="center" pad={{ "vertical": "small", "horizontal": "medium" }} direction="row" gap="small" fill="vertical">
                <Globe />
                <Text weight="bold" size="large">
                    hub.coding.earth
                </Text>
            </Box>
        </Button>
        <AddControl />
    </Box>
)