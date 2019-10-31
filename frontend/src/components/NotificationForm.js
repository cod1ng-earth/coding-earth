import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/Notifications'

export default observer(() => {
    const store = useStore()
    const onSubmit = (evt) => {
        evt.stopPropagation()
        evt.preventDefault()
        store.addNotification("hello")
        return false;
    }

    return (
        <form onSubmit={onSubmit}>
            Total nots: {store.notifications.length}
            <input type="text" id="message" />
            <input type="submit" value="add" />
        </form>
    )
})