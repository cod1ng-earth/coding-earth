import React from 'react'

import { Navbar } from 'react-bulma-components/lib';

export default function() {
    return <Navbar
        color="primary"
    >
        <Navbar.Brand>
            <Navbar.Item renderAs="a" href="#">
                Coding Challenge
            </Navbar.Item>
        </Navbar.Brand>
        <Navbar.Menu >
            <Navbar.Container>

            </Navbar.Container>

        </Navbar.Menu>
    </Navbar>
}