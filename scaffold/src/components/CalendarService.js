import React, { useState, useEffect } from 'react';

import componentData from "../componentData";
import { Table, Heading, Level, Button } from 'react-bulma-components'
import classnames from 'classnames'
import dfns from 'date-fns'
import {Box, Content, Media, Tag, Columns} from "react-bulma-components/dist";
import truncate from "../lib/truncate";

function calendar(first) {
    const last = dfns.endOfMonth(first)
    let firstMonday = first
    let lastSunday = last

    while (!dfns.isMonday(firstMonday)) {
        firstMonday = dfns.subDays(firstMonday, 1)
    }
    while (!dfns.isSunday(lastSunday)) {
        lastSunday = dfns.addDays(lastSunday,1)
    }

    const allDays = dfns.eachDay(firstMonday, lastSunday)
    const weeks = []
    while (allDays.length) {
        weeks.push(allDays.splice(0, 7));
    }
    return weeks
}

function daysWithEvents(events) {
    const days = {};
    events.forEach(ev => {
        const start = dfns.format(new Date(ev.start), 'MM-DD')
        if (!days[start]) days[start] = []
        days[start].push(ev)
    })
    return days
}

const Day = ({day, month, active, events, onSelect}) => {

    return  <td onClick={() => { return events.length === 0 ? false : onSelect(day) } } className={classnames({
        day: true,
        'light': !dfns.isSameMonth(day, month) || events.length === 0,
        'today': dfns.isToday(day),
        'active': active,
        'event-border': events.length > 0
    })}>
        {dfns.format(day, 'D')}
    </td>
}

const Calendar = ({month, events, setActive, active}) => {

    const cal = calendar(month)
    const eventDays = daysWithEvents(events)

    return <Table striped={false} bordered={true}>
        <thead>
        <tr>
            {cal[0].map((day, i) => <th key={`d-${i}`}>{dfns.format(day, 'dd')}</th>)}
        </tr>
        </thead>
        <tbody>
        {cal.map(
            week => (
                <tr key={`w-${dfns.getISOWeek(week[0])}`}>
                    {week.map(day => {
                        const activeDay = dfns.isSameDay(day, active)
                        const dd = dfns.format(day, "MM-DD")
                        return <Day key={dd} events={eventDays[dd] || []}
                                    onSelect={selected => setActive(activeDay ? null : selected)}
                                    active={activeDay}
                                    day={day}
                                    month={month}/>
                    })}
                </tr>
            ))
        }
        </tbody>
    </Table>
}


const Event = (evt) => {
    const tags = [
        evt.type,
        ...evt.tags
    ]
    return <Box>
        <Media>
            <Media.Item>
                <Heading size={6}>{evt.summary}</Heading>
                <Heading subtitle size={6}>
                    {evt.start.toLocaleDateString() } - {evt.end.toLocaleDateString()} <br />
                    <small>{evt.location}</small> <br />
                    <a href={evt.url} target="_blank">{evt.url}</a>
                </Heading>

                <Content>
                    {evt.description && truncate(evt.description, 400)}
                </Content>
                {tags.map(t => <Tag key={t}>{t}</Tag>)}
            </Media.Item>
        </Media>
    </Box>
}

export default props => {

    const first = dfns.startOfMonth(new Date())

    const [events, setEvents] = useState([]);
    const [month, setMonth] = useState(first);
    const [active, setActive] = useState(null)

    useEffect( () => {
        componentData(props.tag, (evts) => {

            setEvents(evts.map(evt => ({
                ...evt,
                start: new Date(evt.start),
                end: new Date(evt.end)
            })))
        }, {
            from: dfns.format(month, 'YYYY-MM-DD'),
            to: dfns.format(dfns.addMonths(month, 1), 'YYYY-MM-DD')
        })
    }, [month]);

    return (
        <div className="calendar">
            <Level >
                <Level.Side align="left">
                    <Level.Item>
                        <Button onClick={() => setMonth(dfns.subMonths(month, 1))}>prev</Button>
                    </Level.Item>
                </Level.Side>
                <Level.Item>
                    <Heading size={4}>{dfns.format(month, "MMMM YYYY")}</Heading>
                </Level.Item>
                <Level.Side align="right">
                <Level.Item>
                    <Button onClick={() => setMonth(dfns.addMonths(month, 1))}>next</Button>
                </Level.Item>
                </Level.Side>
            </Level>

            <Columns>
                <Columns.Column>
                    <Calendar active={active} setActive={setActive} events={events} month={month}  />
                </Columns.Column>
            </Columns>

            {events.map( (ev, i) => {
                if (active && !dfns.isSameDay(active, ev.start))
                    return
                else
                    return <Event key={`evt-${i}`} {...ev} />
            })}

        </div>
    );
}
