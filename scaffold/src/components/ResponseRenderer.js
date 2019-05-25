import React, { useState, useEffect }from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

function responseFilter(data, filter) {
    if (typeof data.filter === 'function') {
        return data.filter(item => filter.test(JSON.stringify(item)))
    }
    return data;
}

export default props => {

    const [content, setContent] = useState({});

    useEffect(() => {
        props.componentData(props.tag, setContent, responseFilter)
    }, [props]);

    const sContent = JSON.stringify(content, null, 4)

    return <SyntaxHighlighter language="json" style={darcula}>{sContent}</SyntaxHighlighter>
}
