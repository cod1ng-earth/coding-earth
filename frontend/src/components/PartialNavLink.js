import React from "react";
import { Link } from '@reach/router'

export default (props) => {

    const isActive = ({ isPartiallyCurrent }) => {
        return isPartiallyCurrent ? { "active": true } : null
    }
    return <Link getProps={isActive} {...props} />

}