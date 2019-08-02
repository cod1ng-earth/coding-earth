import React, { useState, useEffect } from 'react';
import componentData from '../componentData'
import eventEmitter from '../lib/event-emitter'

import { Box, Media, Image, Content } from 'react-bulma-components';

export default class Tweets extends React.Component {

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
                    <Box key={tweet.id}>
                        <Media>
                            <Media.Item renderAs="figure" position="left">
                                <Image renderAs="p" size={64} alt="64x64" src={tweet.user.profile_image_url_https} />
                            </Media.Item>
                            <Media.Item>
                                <Content>
                                    <p>
                                        <strong>{tweet.user.name}</strong>
                                        <small>@{tweet.user.screen_name}</small>
                                        <br/>
                                        <small>{(new Date(tweet.created_at)).toLocaleString()}</small>

                                        <br />
                                        {tweet.full_text}
                                        <br/>
                                        <a href={`https://twitter.com/${tweet.user.sceen_name}/status/${tweet.id_str}`}>visit</a>
                                    </p>
                                </Content>

                            </Media.Item>
                        </Media>
                    </Box>

                ))

                :
                <p>no tweets found</p>
            }
        </div>
    }
}
