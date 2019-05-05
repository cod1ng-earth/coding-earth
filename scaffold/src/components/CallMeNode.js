import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import axios from 'axios'
import coordinator from '../coordinator'

export default props => {
    const [content, setContent] = useState({});

    useEffect( () => {
        async function fetchData() {
            const routes = await coordinator
            const endpoint = routes.data['coordinator'].endpoint
            const nodeResult = await axios.get(endpoint);
            console.log(nodeResult.data)
            setContent(nodeResult.data);
        }
        fetchData()
    }, []);

    const sContent = JSON.stringify(content, null, 4)

    return (
        <div>
            <h2>from Node</h2>
            <SyntaxHighlighter language="json" style={darcula}>{sContent}</SyntaxHighlighter>
        </div>
    );
}
