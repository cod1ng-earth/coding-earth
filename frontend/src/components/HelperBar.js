import React, {useEffect, useState} from 'react'

import {Navbar} from 'react-bulma-components/lib';
import {endpoint} from '../coordinator';

export default function (props) {

    const [sseDate, setSseDate] = useState("")

    useEffect( () => {
        const evtSource = new EventSource(`${endpoint}/events`);
        evtSource.onmessage = e => {
            console.log(e)
            setSseDate(e.data);
        }
    }, []);

    return <Navbar
        color="black"
        fixed="bottom"
    >
        <Navbar.Menu>
            <Navbar.Container>
                <Navbar.Item >{sseDate}</Navbar.Item>

                {Object.keys(props.services).map(k =>
                    <Navbar.Item href="#" key={k}>{k}</Navbar.Item>
                )}
            </Navbar.Container>
        </Navbar.Menu>
    </Navbar>
}