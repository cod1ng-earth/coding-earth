const atob = require('atob')

const PLATFORM_ROUTES = process.env.REACT_APP_PLATFORM_ROUTES;
const routes = JSON.parse(atob(PLATFORM_ROUTES));

const exposedServices = {};

Object.keys(routes).forEach(endpoint => {
    const service = routes[endpoint]
    if (service.type !== 'redirect') {
        exposedServices[service.upstream] = {
            endpoint,
            original_url: service.original_url
        }
    }
})

export default exposedServices;
