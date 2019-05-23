import React from 'react'

import {Navbar} from 'react-bulma-components/lib';

export default function (props) {

    return <Navbar
        color="black"
        fixed="bottom"
    >
        <Navbar.Menu>
            <Navbar.Container>
                {Object.keys(props.services).map(k =>
                    <Navbar.Item href="#" key={k}>{k}</Navbar.Item>
                )}
            </Navbar.Container>
        </Navbar.Menu>
    </Navbar>
}