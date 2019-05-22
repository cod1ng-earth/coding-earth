import React, { useState, useEffect } from 'react';

import componentData from "../componentData";
import { Columns } from 'react-bulma-components';

export default props => {
    const [content, setContent] = useState([]);

    useEffect( () => {
        componentData("calendarservice", setContent)
    }, []);

    const sContent = content.map( date => (<Columns.Column size={2}><p className="day">{date.d}</p></Columns.Column>));

    return (
        <div className="calendar">
            <Columns >
            {sContent}
            </Columns>
        </div>
    );
}
