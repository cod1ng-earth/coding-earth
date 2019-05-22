import React, { useState, useEffect } from 'react';
import componentData from '../componentData'

import { Card, Content } from 'react-bulma-components';

export default props => {
    const [content, setContent] = useState({});

    useEffect( () => {
        componentData("rssreader", setContent)
    }, []);


    return (
        <Card>
            {content.news ?
                content.news.map(item => (
                    <Card>
                        <Card.Header>
                            <Card.Header.Title>{item.title}</Card.Header.Title>
                        </Card.Header>
                        <Card.Content>
                            <Content>
                                {item.contentSnippet}
                            </Content>
                        </Card.Content>
                        <Card.Footer>
                            <Card.Footer.Item renderAs="a" href={item.link}>
                                visit
                            </Card.Footer.Item>
                        </Card.Footer>
                    </Card>
                ))

                :
                <p>no news yet</p>
            }
        </Card>
    );
}
