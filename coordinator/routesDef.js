const routesDef = defs => {
    const exposedServices = {};
    Object.keys(defs).forEach(endpoint => {
        const service = defs[endpoint]
        if (service.type !== 'redirect') {
            exposedServices[service.upstream] = {
                endpoint,
                original_url: service.original_url
            }
        }
    })
    return exposedServices
}


module.exports = routesDef;
