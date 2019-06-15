import React, { useState, useEffect } from 'react';
import componentData from '../componentData'

import { Card, Content } from 'react-bulma-components';

export default props => {
    const [content, setContent] = useState({});

    useEffect( () => {
        componentData(props.tag, setContent)
    }, []);

    return (
        <Card>
            {content.tweets ?
                content.tweets.map(tweet => (
                    <Card key={tweet.id}>
                        <Card.Header>
                            <Card.Header.Title>{tweet.user.screen_name}</Card.Header.Title>
                        </Card.Header>
                        <Card.Content>
                            <Content>
                                {tweet.text}
                            </Content>
                        </Card.Content>
                        <Card.Footer>
                            <Card.Footer.Item renderAs="a" href={tweet.url}>
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
