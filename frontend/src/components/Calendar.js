import React, { useState, useEffect } from 'react';

import componentData from "../componentData";

import classnames from 'classnames'
import dfns from 'date-fns'
import truncate from "../lib/truncate";
import { Box, Button, Grid, Heading, Table, TableCell as TD, TableRow as TR, TableHeader, TableBody } from 'grommet'

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
    const types = events.map(e => e.type);

    return  <TD onClick={() => { return events.length === 0 ? false : onSelect(day) } } pad={{horizontal: "medium", vertical:"large"}} className={classnames({
        day: true,
        'light': !dfns.isSameMonth(day, month) || events.length === 0,
        'today': dfns.isToday(day),
        'event-meetup': types.includes('meetup'),
        'event-conference': types.includes('conference'),
        'active': active,
    })}>
        {dfns.format(day, 'D')}
    </TD>
}

const Calendar = ({month, events, setActive, active}) => {

    const cal = calendar(month)
    const eventDays = daysWithEvents(events)

    return <Table fill>
        <TableHeader>
        <TR>
            {cal[0].map((day, i) => <TD key={`d-${i}`}>{dfns.format(day, 'dd')}</TD>)}
        </TR>
        </TableHeader>
        <TableBody>
        {cal.map(
            week => (
                <TR key={`w-${dfns.getISOWeek(week[0])}`}>
                    {week.map(day => {
                        const activeDay = dfns.isSameDay(day, active)
                        const dd = dfns.format(day, "MM-DD")
                        return <Day key={dd} events={eventDays[dd] || []}
                                    onSelect={selected => setActive(activeDay ? null : selected)}
                                    active={activeDay}
                                    day={day}
                                    month={month}/>
                    })}
                </TR>
            ))
        }
        </TableBody>
    </Table>
}


const Event = (evt) => {

    return <Box >

                <Heading level={5}>{evt.summary}</Heading>
                <Heading level={6}>
                    {evt.start.toLocaleDateString() } - {evt.end.toLocaleDateString()} <br />
                    <small>{evt.location}</small> <br />
                    <a href={evt.url} target="_blank">{evt.url}</a>
                </Heading>

                <p>
                    {evt.description && truncate(evt.description, 400)}
                </p>
                <p className={`event-${evt.type}`}>{evt.type}</p>
                {evt.tags.map(t => <p key={t}>{t}</p>)}
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
            search: props.search,
            from: dfns.format(month, 'YYYY-MM-DD'),
            to: dfns.format(dfns.addMonths(month, 1), 'YYYY-MM-DD')
        })
    }, [month, props.search]);

    return (
        <Box fill>
            <Box  direction="row" justify="between">
                <Button onClick={() => setMonth(dfns.subMonths(month, 1))} label="prev" />
                <Heading size={4}>{dfns.format(month, "MMMM YYYY")}</Heading>
                <Button onClick={() => setMonth(dfns.addMonths(month, 1))} label="next" />
            </Box>

            <Box>
            <Calendar active={active} setActive={setActive} events={events} month={month}  />
            </Box>
            {events.map( (ev, i) => {
                if (active && !dfns.isSameDay(active, ev.start))
                    return
                else
                    return <Event key={`evt-${i}`} {...ev} />
            })}

        </Box>
    );
}
