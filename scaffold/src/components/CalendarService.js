import React, { useState, useEffect } from 'react';

import { Columns } from 'react-bulma-components';

export default props => {
    const [content, setContent] = useState([]);

    useEffect( () => {
        props.componentData(props.tag, setContent)
    }, [props]);

    return (
        <div className="calendar">
            <Columns className="is-mobile">
            {content.map(
                date => (
                    <Columns.Column size={2} key={date.d}>
                        <p className="day">{date.d}</p>
                    </Columns.Column>
                ))
            }
            </Columns>
        </div>
    );
}
