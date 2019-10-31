import React, { Component } from 'react'
import { Layer } from 'grommet'

//stolen from: https://codesandbox.io/s/9jpz0z2ym4
export default class Toast extends Component {

    render() {
        const { children, modal, position, full, ...rest } = this.props
        return (
            <Layer
                position={position || 'top'}
                full={full}
                modal={modal}
                margin="none"
                responsive
                plain={modal ? false : true}

                {...rest}
            >
                {children}
            </Layer>
        )
    }
}