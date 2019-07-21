import React from 'react'
import RssReader from './RssReader'
import CalendarService from './CalendarService'
import TweetsService from './TweetsService'
import ResponseRenderer from './ResponseRenderer'

const components = {
    "rssreader": RssReader,
    "calendarservice": CalendarService,
    "tweets": TweetsService
};

export default props => {
    const TagName = components[props.tag] || ResponseRenderer
    return <TagName {...props} />
}
