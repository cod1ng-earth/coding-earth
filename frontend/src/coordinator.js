import axios from 'axios'

export const endpoint = process.env.REACT_APP_COORDINATOR ?
    "//" + process.env.REACT_APP_COORDINATOR :
    "//coordinator." + window.location.host

export const coordinator = axios.get(endpoint)

