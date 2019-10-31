import React from 'react';
import componentData from '../componentData'
import { eventEmitter } from '../store/EventSource'
import { Box, Image, Paragraph } from 'grommet'
import truncate from "../lib/truncate";

export default class Videos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            videos: []
        }
    }
    _fetch(search) {
        componentData(
            this.props.component,
            content => this.setState({ videos: content }),
            { search }
        )
    }
    componentDidMount() {
        this._fetch(this.props.search);
        eventEmitter.on('content-video', message => {
            this.setState({ videos: [message.content, ...this.state.videos] });
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.search !== prevProps.search) {
            this._fetch(this.props.search);
        }
    }

    render() {
        console.log(this.state.videos)
        return <div>
            {this.state.videos.length === 0 ? <p>no videos found</p> :
                this.state.videos.map(video => {
                    const item = video._source.items ? video._source.items[0] : video._source

                    return <Box key={item._id} direction="row" gap="medium" elevation="small" alignContent="start" pad="medium" margin={{ vertical: "medium" }} fill>
                        <Box  >
                            <Image src={item.snippet.thumbnails.standard.url} fit="contain" height="large" />
                        </Box>
                        <Box >
                            <Paragraph fill>
                                <strong>{item.snippet.title}</strong>
                                <br />
                                <small>{(new Date(item.snippet.publishedAt)).toLocaleString()}</small>

                                <Paragraph>
                                    {truncate(item.snippet.description, 400)}
                                </Paragraph>
                                <a href={`https://www.youtube.com/watch?v=${item._id}`}>watch</a>
                            </Paragraph>
                        </Box>
                    </Box>
                })}
        </div>
    }
}
