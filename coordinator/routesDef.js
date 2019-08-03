const dontexpose = ['frontend', 'coordinator','rssreader']

const routesDef = (defs, defaultHost, http = false) => {
    const exposedServices = {};
    Object.keys(defs).forEach(url => {
        const service = defs[url]

        //upstreams are noted differently in routes.yaml and PLATFORM_ROUTES :(
        const upstream = service.upstream ? service.upstream.replace(':http', '') : '';
        if (service.type === 'redirect' ||
            dontexpose.includes(upstream) ) {
            return;
        }

        let endpoint = url.replace("{default}", defaultHost);
        if (http) {
           endpoint = endpoint.replace('https', 'http')
        }
        exposedServices[upstream] = {
            endpoint,
            original_url: service.original_url || url
        }
    })
    return exposedServices
}

module.exports = { routesDef };
