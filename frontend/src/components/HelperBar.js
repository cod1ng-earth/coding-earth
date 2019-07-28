import React, {useEffect} from 'react'

import {Navbar} from 'react-bulma-components/lib';
import {endpoint} from '../coordinator';

export default function (props) {

    useEffect( () => {
        const evtSource = new EventSource(`${endpoint}/events`);
        evtSource.onmessage = e => {
            console.log(e);
        }
    }, []);

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