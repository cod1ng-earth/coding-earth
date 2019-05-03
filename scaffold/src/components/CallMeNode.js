import React, { useState, useEffect } from 'react';
import axios from 'axios'

const endpoint = process.env.REACT_APP_CALLMENODE;

export default props => {
    const [content, setContent] = useState("");

    useEffect( () => {
        async function fetchData() {
            const nodeResult = await axios.get(endpoint);
            setContent(nodeResult);
        }
        fetchData()
    }, []);

    return (
        <div>
            <h2>from Node</h2>
            {content}
        </div>
    );
}
