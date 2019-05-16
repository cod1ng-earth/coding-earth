import React, { useState, useEffect } from 'react';

import componentData from "../componentData";
import Heading from "./Heading";

export default props => {
    const [content, setContent] = useState({});

    useEffect( () => {
        componentData("calendarservice", setContent)
    }, []);

    const sContent = JSON.stringify(content, null, 4)

    return (
        <div>
            <Heading level={2}>Calendar</Heading>
            {sContent}
        </div>
    );
}
