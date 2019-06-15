import React, { useState, useEffect }from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import componentData from "../componentData";

export default props => {

    const [content, setContent] = useState({});

    useEffect(() => {
        componentData(props.tag, setContent)
    }, []);

    const sContent = JSON.stringify(content, null, 4)

    return <SyntaxHighlighter language="json" style={darcula}>{sContent}</SyntaxHighlighter>
}