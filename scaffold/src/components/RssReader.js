import React, { useState, useEffect } from 'react';
import styled from 'styled-components'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import componentData from '../componentData'
import Heading from './Heading'

const NewsBox = styled.div`
    padding: 1em 0.5em
    background-color: #EEE
    margin-bottom: 0.2em
`

const Link = styled.a`
    color: green
`

export default props => {
    const [content, setContent] = useState({});

    useEffect( () => {
        componentData("rssreader", setContent)
    }, []);


    return (
        <div>
            <Heading level={2}>News</Heading>
            {/*<SyntaxHighlighter language="json" style={darcula}>{sContent}</SyntaxHighlighter>*/}
            {content.feed ?
                content.feed.items.map(item => {
                    return <NewsBox>
                        <Link href={item.link} target="_blank">{item.title}</Link>
                    </NewsBox>
                })

                :
                <p>no news yet</p>
            }
        </div>
    );
}
