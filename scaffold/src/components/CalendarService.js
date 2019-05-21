import React, { useState, useEffect } from 'react';

import componentData from "../componentData";
import Heading from "./Heading";

export default props => {
    const [content, setContent] = useState([]);

    useEffect( () => {
        componentData("calendarservice", setContent)
    }, []);

    const sContent = content.map( date => (<li>{date}</li>))

    return (
        <div>
            <Heading level={2}>Calendar</Heading>
            <ul>
            {sContent}
            </ul>
        </div>
    );
}
