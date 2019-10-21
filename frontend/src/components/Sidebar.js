import React from 'react'
import { Box, Grid, Button, Text, Menu } from 'grommet'
import { Home, StatusCritical } from 'grommet-icons'



export default class Sidebar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {

    }
    render() {
        return <Grid columns={["small", "auto"]}>
            <Box justify="between" background="dark-1">
                <Box>
                    <Button hoverIndicator={true} fill="vertical">
                        <Box align="center" pad={{ "horizontal": "medium", "vertical": "small" }} direction="row" gap="small">
                            <Home />
                            <Text size="large" weight="bold">

                            </Text>
                        </Box>
                    </Button>

                </Box>

            </Box>

        </Grid >

    }
}