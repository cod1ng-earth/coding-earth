import React, { useState, useEffect } from 'react';
import componentData from '../componentData'
import eventEmitter from '../lib/event-emitter'

import { Card, Content } from 'react-bulma-components';

export default class TweetsService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tweets: []
        }
    }
    _fetch(search) {
        componentData(
            this.props.tag,
            content => this.setState({tweets: content.tweets}),
            { search }
        )
    }
    componentDidMount() {
        this._fetch( this.props.search );
        eventEmitter.on('content-tweet', message => {
            const tw = this.setState({tweets: [message.content, ...this.state.tweets]});
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.search !== prevProps.search) {
            this._fetch(this.props.search);
        }
    }

    render() {
        const tweets = this.state.tweets;
        return <div>
            {tweets.length > 0 ?
                tweets.map(tweet => (
                    <Card key={tweet.id}>
                        <Card.Header>
                            <Card.Header.Title>{tweet.user.screen_name}</Card.Header.Title>
                        </Card.Header>
                        <Card.Content>
                            <Content>
                                {tweet.full_text}
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
                <p>no tweets found</p>
            }
        </div>
    }
}
