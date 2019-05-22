import React from 'react'
import Navbar from './components/Navbar'
import HelperBar from './components/HelperBar'
import RssReader from './components/RssReader'
import CalendarService from './components/CalendarService'

import './index.scss';

import {  Section, Container, Columns, Heading} from 'react-bulma-components/lib';

export default props => {

  return (
      <div>
        <Navbar />
          <Section>
              <Container>
                  <Columns>
                      <Columns.Column>
                          <Heading>News</Heading>
                          <RssReader/>
                      </Columns.Column>
                      <Columns.Column>
                          <Heading>Calendar</Heading>
                          <CalendarService></CalendarService>
                      </Columns.Column>
                  </Columns>
              </Container>
      </Section>
       <HelperBar />
    </div>
  );
}


