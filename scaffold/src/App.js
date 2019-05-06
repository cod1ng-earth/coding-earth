import React, { useState, useEffect } from 'react';

import RssReader from './components/RssReader'
import CallMePhp from './components/CallMePhp'
import styled from "styled-components";
import { Container, Row, Col } from 'react-awesome-styled-grid'
import Heading from './components/Heading'

import coordinator from "./coordinator";

const Wrapper = styled.section`
  font-family: 'Source Sans Pro', sans-serif;
`;

export default props => {

    const [routes, setRoutes] = useState({});

    useEffect( () => {
        async function fetchData() {
            const routes = await coordinator
            setRoutes(routes.data);
        }
        fetchData()
    }, []);


  return (
    <Wrapper>

        <Container>
            <Heading level={1}>Known routes</Heading>
            <Row>
                <Col>
                    <ul>
                        {Object.keys(routes).map(k => <li key={k}>{k}</li>)}
                    </ul>
                </Col>
            </Row>
        </Container>


        <Container>
            <Row>
                <Col>
                    <RssReader/>
                </Col>
                <Col>
                    <CallMePhp></CallMePhp>
                </Col>
            </Row>
        </Container>
    </Wrapper>
  );
}


