import React from 'react'
import { Box, Grid, Button, Text, Menu } from 'grommet'
import { Home, StatusCritical } from 'grommet-icons'
import { Link } from '@reach/router'

const PartialNavLink = props => {
    const isActive = ({ isPartiallyCurrent }) => {
        return isPartiallyCurrent ? { "active": true } : null
    }
    return <Link getProps={isActive} {...props} />
}

export default class Sidebar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {

    }

    render() {


        const nav = Object.keys(this.props.services).map(k => (
            <Button as={PartialNavLink} to={`/${k}`} hoverIndicator={true} fill="vertical" key={`link-${k}`}>
                <Box align="center" pad={{ "horizontal": "medium", "vertical": "small" }} direction="row" gap="small">
                    <Text size="large" weight="bold">
                        {k}
                    </Text>
                </Box>
            </Button>
        ))

        return <Grid columns={["small", "auto"]}>
            <Box justify="between" background="dark-1">
                <Box>

                    {nav}

                </Box>

            </Box>

        </Grid >

    }
}