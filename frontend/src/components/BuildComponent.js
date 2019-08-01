import React from 'react'
import RssReader from './RssReader'
import Calendar from './Calendar'
import TweetsService from './TweetsService'
import ResponseRenderer from './ResponseRenderer'

const components = {
    "rssreader": RssReader,
    "calendar": Calendar,
    "tweets": TweetsService
};

export default props => {
    const TagName = components[props.tag] || ResponseRenderer
    return <TagName {...props} />
}
