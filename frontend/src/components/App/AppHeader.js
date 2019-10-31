import React from 'react'
import { Link } from '@reach/router'
import { Box, Button, Text, Layer } from 'grommet'
import { Globe, Menu } from 'grommet-icons'
import AddControl from './AddControl'

export default ({ onSubmitted, toggleSidebar }) => (

    <Box justify="between" direction="row" background="dark-3" flex={false} tag="header">

        <Button as={Link} to="/" hoverIndicator={true} fill="vertical">
            <Box align="center" justify="center" pad={{ "vertical": "small", "horizontal": "medium" }} direction="row" gap="small" fill="vertical">
                <Globe />
                <Text >
                    hub.coding.earth
                </Text>
            </Box>
        </Button>
        <Box direction="row"  >

            <AddControl onSubmitted={onSubmitted} />
            <Button margin="small" onClick={toggleSidebar}><Menu /></Button>
        </Box>
    </Box>
)