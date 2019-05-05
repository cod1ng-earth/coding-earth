import axios from 'axios'

const promise = axios.get(process.env.REACT_APP_COORDINATOR)

export default promise;
