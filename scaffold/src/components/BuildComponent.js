import React from 'react'
import RssReader from './RssReader'
import CalendarService from './CalendarService'
import ResponseRenderer from './ResponseRenderer'

const components = {
    "rssreader": RssReader,
    "calendarservice": CalendarService
};

export default props => {
    const TagName = components[props.tag] || ResponseRenderer
    return <TagName {...props} />
}
