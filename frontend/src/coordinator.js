import axios from 'axios'

const endpoint = process.env.REACT_APP_COORDINATOR ?
    "//" + process.env.REACT_APP_COORDINATOR :
    "//coordinator." + window.location.host

const promise = axios.get(endpoint)

export default promise;
