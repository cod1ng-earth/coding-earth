import React, { useState, useEffect } from 'react';
import componentData from '../componentData'
import truncate from '../lib/truncate'

import { Box, Media, Content, Heading, Tag } from 'react-bulma-components';


const NewsCard = ({item}) => {

    const pubDate = new Date(item.pubDate).toLocaleString()
    return <Box>
        <Media>
            <Media.Item>
                <Heading size={6}>{item.title}</Heading>
                <Heading subtitle size={6}>
                    {pubDate} - {' '}
                    <a href={item.link} target="_blank">{item.id}</a>
                </Heading>

                <Content>
                    {truncate(item.contentSnippet, 300)}
                </Content>

                {item.categories && item.categories.map(c => (<Tag key={c}>{c}</Tag>))}
            </Media.Item>
        </Media>
    </Box>
}

export default props => {
    const [content, setContent] = useState({});

    useEffect( () => {
        componentData(props.tag, setContent, {search: props.search})
    }, [props.search]);

    return (
        <div>
            {content.news ?
                content.news.map(item => <NewsCard item={item} key={item.id} />)
                :
                <p>no news yet</p>
            }
        </div>
    );
}
