import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Heading, Paragraph, Table, Text } from 'grommet'
import truncate from "../../lib/truncate";

export default (props) => {

    return <Box direction="row" justify="start" gap="medium" elevation="small" pad="medium" margin={{ vertical: "medium" }} fill>
        <Box fill>

            <Text>  {props.start.toLocaleDateString()} - {props.end.toLocaleDateString()} </Text>
            <Text>{props.location}</Text>
            <Text><a href={props.url} target="_blank">{props.url}</a> </Text>
            <Paragraph fill>
                {props.description && truncate(props.description, 400)}
            </Paragraph>
            <p className={`event-${props.type}`}>{props.type}</p>
            {props.tags.map(t => <p key={t}>{t}</p>)}
        </Box>
    </Box>

}