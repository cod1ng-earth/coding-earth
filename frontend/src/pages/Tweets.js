import React from 'react';
import componentData from '../componentData'
import eventEmitter from '../lib/event-emitter'
import { Box, Button, Image, Paragraph } from 'grommet'

export default class Tweets extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tweets: []
        }
    }
    _fetch(search) {
        componentData(
            this.props.component,
            content => this.setState({ tweets: content.tweets }),
            { search }
        )
    }
    componentDidMount() {
        this._fetch(this.props.search);
        eventEmitter.on('content-tweet', message => {
            this.setState({ tweets: [message.content, ...this.state.tweets] });
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.search !== prevProps.search) {
            this._fetch(this.props.search);
        }
    }

    render() {
        return <div>
            {this.state.tweets.length === 0 ? <p>no tweets found</p> :
                this.state.tweets.map(tweet => (
                    <Box key={tweet.id} direction="row" justify="start" gap="medium" elevation="small" pad="medium" margin={{ vertical: "medium" }} fill>
                        <Box width="small" >
                            <Image src={tweet.user.profile_image_url_https} width={90} />
                        </Box>
                        <Box fill>
                            <Paragraph fill>
                                <strong>{tweet.user.name}</strong>
                                <small>@{tweet.user.screen_name}</small>
                                <br />
                                <small>{(new Date(tweet.created_at)).toLocaleString()}</small>

                                <br />
                                {tweet.full_text}
                                <br />
                                <a href={`https://twitter.com/${tweet.user.sceen_name}/status/${tweet.id_str}`}>visit</a>
                            </Paragraph>
                        </Box>
                    </Box>
                ))
            }
        </div>
    }
}
