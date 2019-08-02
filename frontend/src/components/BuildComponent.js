import React from 'react'
import RssReader from './RssReader'
import Calendar from './Calendar'
import Tweets from './Tweets'
import ResponseRenderer from './ResponseRenderer'

const components = {
    "rssreader": RssReader,
    "calendar": Calendar,
    "tweets": Tweets
};

export default props => {
    const TagName = components[props.tag] || ResponseRenderer
    return <TagName {...props} />
}
