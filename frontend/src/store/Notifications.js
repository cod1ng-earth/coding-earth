import React, { createContext, useContext } from 'react'
import { useLocalStore } from 'mobx-react'

const DURATION = 1500;

export function createStore() {

    return {
        notifications: [],
        timeout: null,
        clearNotifications() {
            this.notifications.replace([])
        },
        addNotification(message) {
            this.notifications.push(message)
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(this.clearNotifications, DURATION)
        },
        humanNotification(message) {
            const msg = `${message.type}:${message.url} has been added`
            this.addNotification(msg)
        }
    }
}

const Context = createContext(null)

export const Provider = ({ children }) => {
    const store = useLocalStore(createStore)
    return <Context.Provider value={store}>{children}</Context.Provider>
}

export const useStore = () => {
    const store = useContext(Context)
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.')
    }
    return store
}