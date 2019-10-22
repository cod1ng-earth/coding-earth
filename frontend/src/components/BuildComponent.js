import React from 'react'
//import RssReader from './RssReader'
import Calendar from '../pages/Calendar'
import Tweets from '../pages/Tweets'
import ResponseRenderer from './ResponseRenderer'
import Comics from '../pages/Comics';
import Videos from '../pages/Videos';
import { Box, Heading } from 'grommet'

const components = {
    //"rssreader": RssReader,
    "calendar": Calendar,
    "tweets": Tweets,
    "comics": Comics,
    "videos": Videos
};

export default props => {
    const TagName = components[props.component] || ResponseRenderer
    return <Box>
        <Heading margin={{ vertical: "medium" }}>{props.component}</Heading>
        <TagName {...props} />
    </Box>
}
