import React, { useState, useEffect } from 'react';
import axios from 'axios'
import coordinator from '../coordinator'

export default props => {
    const [content, setContent] = useState("");

    useEffect( () => {
        async function fetchData() {
            const routes = await coordinator
            const endpoint = routes.data['phpservice'].endpoint
            const phpResult = await axios.get(endpoint);
            console.log(phpResult)
            setContent(phpResult.data);
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
