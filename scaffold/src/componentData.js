import coordinator from "./coordinator";
import axios from "axios";

export default function componentData(dataFilter) {
    return async (serviceName, setContent, filterBy) => {
        const routes = await coordinator
        const endpoint = routes.data[serviceName].endpoint
        const nodeResult = await axios.get(endpoint);
        setContent(dataFilter && filterBy ? filterBy(nodeResult.data, dataFilter) : nodeResult.data);
    }
}
