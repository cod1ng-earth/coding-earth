import React from 'react'
import { Text, Box } from 'grommet'
import Toast from '../components/Toast'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/Notifications'

//stolen from: https://codesandbox.io/s/9jpz0z2ym4
export default observer(() => {
    const store = useStore()

    return (
        <Toast
            margin={{ top: "large" }}
            position="top-right"
            modal={false}
            full={false}
            responsive={false}
        >
            {
                store.notifications.map((n, i) => (
                    <Box
                        direction="row"
                        justify="between"
                        align="center"
                        elevation="small"
                        pad={{ vertical: `small`, left: `medium` }}
                        background="light-3"
                        width="large"
                        gap="large"
                        margin={{ bottom: 'small' }}
                    >
                        <Text size="medium">{n}</Text>
                    </Box>
                ))
            }
        </Toast >
    )
})

