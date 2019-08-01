# The Coordinator

This is the service orchestrator. When running in production (aka on platform.sh) it will rely on the $PLATFORM_ROUTES environment. In local mode it trusts the local .platform/routes.yaml. 

The coordinator exposes service endpoints so that our frontend can determine available services at runtime. A typical response looks like

```json
{
  "rssreader": {
    "endpoint": "http://rssreader.cearth.local:8000/",
    "original_url": "https://rssreader.{default}/"
  },
  "calendar": {
    "endpoint": "http://calendar.cearth.local:8000/",
    "original_url": "https://calendar.{default}/"
  },
  "tweets": {
    "endpoint": "http://tweets.cearth.local:8000/",
    "original_url": "https://tweets.{default}/"
  }
}
```

in local environments all TLS routes are rewritten to "unsecure" ones to avoid having you registering your local ssl / ca certs.
