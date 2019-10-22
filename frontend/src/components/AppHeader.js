import React from 'react'

import { Box, Button, Text, Menu } from 'grommet'
import { AidOption, User } from 'grommet-icons'
import AddControl from './AddControl'

export default () => (

    <Box justify="between" direction="row" background="dark-3">

        <Button hoverIndicator={true} fill="vertical">
            <Box align="center" justify="center" pad={{ "vertical": "small", "horizontal": "medium" }} direction="row" gap="small" fill="vertical">
                <AidOption />
                <Text weight="bold" size="large">
                    hub.coding.earth
                </Text>
            </Box>
        </Button>
        <AddControl />
    </Box>


)