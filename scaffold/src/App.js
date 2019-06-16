import React, {useState, useEffect} from 'react'
import Navbar from './components/Navbar'
import HelperBar from './components/HelperBar'
import BuildComponent from './components/BuildComponent';

import './index.scss';

import {  Section, Container, Columns, Heading } from 'react-bulma-components/lib';

import coordinator from "./coordinator";

export default props => {

    const [knownServices, setServices] = useState({});
    const [search, setSearch] = useState("")

    useEffect(() => {
        async function fetchData() {
            const routes = await coordinator;
            setServices(routes.data);
        }

        fetchData()
    }, []);

  return (
      <div>
        <Navbar onSearch={newSearch => setSearch(newSearch)}/>
          <Section>
              <Container>
                  <Columns>
                      {Object.keys(knownServices).map(k =>
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


