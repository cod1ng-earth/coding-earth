import coordinator from "./coordinator";
import axios from "axios";

export default async function (serviceName, setContent) {
    const routes = await coordinator
    const endpoint = routes.data[serviceName].endpoint
    const nodeResult = await axios.get(endpoint);
    setContent(nodeResult.data);
}