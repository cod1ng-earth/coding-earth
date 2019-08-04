import React, {useEffect, useState} from 'react'
import Navbar from './components/Navbar'
import HelperBar from './components/HelperBar'
import BuildComponent from './components/BuildComponent';
import AddControl from "./components/AddControl";
import eventEmitter from './lib/event-emitter'

import './index.scss';

import {Columns, Container, Heading, Section} from 'react-bulma-components/lib';
import {coordinator, endpoint} from "./coordinator";

export default props => {

    const [knownServices, setServices] = useState({});
    const [search, setSearch] = useState("")

    useEffect(() => {
        async function fetchData() {
            const routes = await coordinator;
            setServices(routes.data);
        }

        fetchData()

        const eventSource = new EventSource(`${endpoint}/events`);
        eventSource.onmessage = msg => {
            if ('ping' === msg.data)
                return false;

            const message = JSON.parse(msg.data);
            eventEmitter.emit(`content-${message.type}`, message);
        }
    }, []);

    return (
        <div>
            <Navbar onSearch={newSearch => setSearch(newSearch)}/>
            <Section>
                <Container>
                    <AddControl/>
                </Container>
            </Section>
            <Section>
                <Container>
                    <Columns>
                        <Columns.Column size="half" key='comics'>
                            <Heading>Comics</Heading>
                            <BuildComponent tag='comics' search={search}/>
                        </Columns.Column>

                        <Columns.Column size="half" key='tweets'>
                            <Heading>Tweets</Heading>
                            <BuildComponent tag='tweets' search={search}/>
                        </Columns.Column>
                    </Columns>
                </Container>
            </Section>

            <Section>
                <Container>
                    <Columns>
                        {Object.keys(knownServices)
                            .filter(service => service!=='tweets' && service!=='comics')
                            .map(k =>
                            <Columns.Column size="half" key={k}>
                                <Heading>{k}</Heading>
                                <BuildComponent tag={k} search={search}/>
                            </Columns.Column>
                        )}
                    </Columns>

                </Container>
            </Section>
            <HelperBar services={knownServices}/>
        </div>
    );
}

/*

 */
