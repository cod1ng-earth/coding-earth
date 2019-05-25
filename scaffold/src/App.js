import React, {useState, useEffect} from 'react'
import Navbar from './components/Navbar'
import HelperBar from './components/HelperBar'
import BuildComponent from './components/BuildComponent';
import componentData from './componentData'

import './index.scss';

import {  Section, Container, Columns, Heading } from 'react-bulma-components/lib';

import coordinator from "./coordinator";

export default props => {

    const [knownServices, setServices] = useState({});
    const [dataFilter, setDataFilter] = useState(undefined);

    function setFilter(input) {
      console.log(input);
      setDataFilter(input ? new RegExp(input, 'i') : undefined);
    }

    useEffect(() => {
        async function fetchData() {
            const routes = await coordinator;
            setServices(routes.data);
        }

        fetchData()
    }, [dataFilter]);

  return (
      <div>
        <Navbar setFilter={setFilter}/>
          <Section>
              <Container>
                  <Columns>
                      {Object.keys(knownServices).map(k =>
                      <Columns.Column size="half" key={k}>
                          <Heading>{k}</Heading>
                          <BuildComponent componentData={componentData(dataFilter)} tag={k}/>
                      </Columns.Column>
                      )}
                  </Columns>
              </Container>
          </Section>
       <HelperBar services={knownServices}/>
    </div>
  );
}


