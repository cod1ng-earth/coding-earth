import React, { useState, useEffect } from 'react';

import componentData from "../componentData";
import styled from 'styled-components'
import dfns from 'date-fns'
import Event from '../components/Calendar/Event'

import { Box, Button, Grid, Heading, Table, TableCell as TD, TableRow as TR, TableHeader, TableBody, Text, ThemeContext } from 'grommet'

const TDay = styled(Box)`
    background: ${props => props.styl.active ? 'rgba(0,0,255,.07)' : ''};
    color: ${props => props.styl.light ? "#CCC" : props.styl.active ? '#1f24cc' : ''};
    text-decoration: ${props => props.styl.today ? "underline" : "none"};
    box-shadow: ${props => props.styl.active ? 'rgba(0,0,0,.25) 1px 1px 3px -1px inset' : props.styl.eventConference ? '#0fd9a3 0 -6px 0 0 inset' : 'none'};
    font-weight: ${props => props.styl.today ? 'bold' : ''};
    border-bottom: ${props => props.styl.eventMeetup ? '3px solid #F54261' : ''};
`

function calendar(first) {
    const last = dfns.endOfMonth(first)
    let firstMonday = first
    let lastSunday = last

    while (!dfns.isMonday(firstMonday)) {
        firstMonday = dfns.subDays(firstMonday, 1)
    }
    while (!dfns.isSunday(lastSunday)) {
        lastSunday = dfns.addDays(lastSunday, 1)
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

const Day = ({ day, month, active, events, onSelect }) => {
    const types = events.map(e => e.type);
    const styles = {
        light: !dfns.isSameMonth(day, month) || events.length === 0,
        today: dfns.isToday(day),
        eventMeetup: types.includes('meetup'),
        eventConference: types.includes('conference'),
        active: active
    }
    return <TD onClick={() => { return events.length === 0 ? false : onSelect(day) }} pad="none">
        <TDay fill styl={styles} height="medium" pad="medium" align="center">
            {dfns.format(day, 'D')}
        </TDay>
    </TD >
}

const Calendar = ({ month, events, setActive, active }) => {

    const cal = calendar(month)
    const eventDays = daysWithEvents(events)

    return <Table>
        <TableHeader>
            <TR >
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
                                month={month} />
                        })}
                    </TR>
                ))
            }
        </TableBody>
    </Table>
}


export default props => {

    const first = dfns.startOfMonth(new Date())

    const [events, setEvents] = useState([]);
    const [month, setMonth] = useState(first);
    const [active, setActive] = useState(null)

    useEffect(() => {
        componentData(props.component, (evts) => {
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
    }, [month, props.component, props.search]);

    return (
        <Box>
            <Box width="medium">
                <Box direction="row" fill justify="between" height="xxsmall" margin={{ bottom: "medium" }}>
                    <Button onClick={() => setMonth(dfns.subMonths(month, 1))} label="prev" />
                    <Text >{dfns.format(month, "MMMM YYYY")}</Text>
                    <Button onClick={() => setMonth(dfns.addMonths(month, 1))} label="next" />
                </Box>

                <Box>
                    <ThemeContext.Extend
                        value={{
                            table: {
                                header: { border: "bottom", align: "center" },
                                body: { border: "3px solid red" }
                            },
                        }}
                    >
                        <Calendar active={active} setActive={setActive} events={events} month={month} />
                    </ThemeContext.Extend>
                </Box>
            </Box>
            <Box >
                {
                    events.map((ev, i) => {
                        if (active && !dfns.isSameDay(active, ev.start))
                            return
                        else
                            return <Event key={`evt-${i}`} {...ev} />
                    })
                }
            </Box>
        </Box>

    );
}
