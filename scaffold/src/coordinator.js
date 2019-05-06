import axios from 'axios'

const endpoint = process.env.REACT_APP_COORDINATOR ||
                 "https://coordinator." + window.location.hostname

const promise = axios.get(endpoint)

export default promise;
