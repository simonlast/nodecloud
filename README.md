###Run many node.js apps on one server with node-http-proxy.
For use on my personal sites.

###Configuration (config.json)

  {
    "base": "base url for your sites",
    "startPort": 8000,
    "sites": [
      {
        "name": "subdomain",
        "dir": "dir/",
        "start": "server.js"
      },
      ...
    ]
  }