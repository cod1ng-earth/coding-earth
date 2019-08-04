import React from 'react'
import RssReader from './RssReader'
import Calendar from './Calendar'
import Tweets from './Tweets'
import ResponseRenderer from './ResponseRenderer'
import Comics from './Comics';

const components = {
    "rssreader": RssReader,
    "calendar": Calendar,
    "tweets": Tweets,
    "comics": Comics
};

export default props => {
    const TagName = components[props.tag] || ResponseRenderer
    return <TagName {...props} />
}
