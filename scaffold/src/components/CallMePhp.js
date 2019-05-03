import React, { useState, useEffect } from 'react';
import axios from 'axios'

const endpoint = process.env.REACT_APP_CALLMEPHP;

export default props => {
    const [content, setContent] = useState("");

    useEffect( () => {
        async function fetchData() {
            const phpResult = await axios.get(endpoint);
            setContent(phpResult);
        }
        fetchData()
    }, []);

    return (
        <div>
            <h2>from PHP</h2>
            {content}
        </div>
    );
}
