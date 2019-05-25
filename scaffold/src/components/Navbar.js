import React from 'react'

import { Navbar } from 'react-bulma-components/lib';

export default function NavBar({setFilter}) {
    // use

    return <Navbar color="primary" >
        <Navbar.Brand>
            <Navbar.Item renderAs="a" href="#">
                Coding Challenge
            </Navbar.Item>
        </Navbar.Brand>
        <input type="text" onChange={(e) => setFilter(e.target.value)} />
    </Navbar>
}
