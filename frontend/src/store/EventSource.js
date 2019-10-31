import React, { useEffect } from 'react'
import { endpoint } from '../coordinator'
import EventEmitter from "events";

import { observer } from 'mobx-react-lite'
import { useStore } from '../store/Notifications'

export const eventEmitter = new EventEmitter();

export const EventProvider = observer(() => {
    const store = useStore()
    useEffect(() => {
        const eventSource = new EventSource(`${endpoint}/events`);
        eventSource.onmessage = msg => {
            if ("ping" === msg.data) {
                return false;
            }

            const message = JSON.parse(msg.data);
            store.humanNotification(message)
            eventEmitter.emit(`content-${message.type}`, message);
        };
        return () => {
            eventSource.close()
        }
    }, [store])

    return;
})

