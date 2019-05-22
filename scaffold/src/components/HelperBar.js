import React, {useState, useEffect} from 'react'

import {Navbar} from 'react-bulma-components/lib';
import coordinator from "../coordinator";

export default function () {
    const [routes, setRoutes] = useState({});

    useEffect(() => {
        async function fetchData() {
            const routes = await coordinator;
            setRoutes(routes.data);
        }

        fetchData()
    }, []);

    return <Navbar
        color="black"
        fixed="bottom"
    >
        <Navbar.Menu>
            <Navbar.Container>
                {Object.keys(routes).map(k =>
                    <Navbar.Item href="#" key={k}>{k}</Navbar.Item>
                )}
            </Navbar.Container>
        </Navbar.Menu>
    </Navbar>
}