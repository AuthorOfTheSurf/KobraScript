$ Hapi = require('hapi')

// Create a server with a host and port
$ server = new Hapi.Server()
$ port = 8000

server.connection({
    host: 'localhost',
    port: port
})

// Add the route
server.route({
    method: 'GET',
    path:'/hello',
    handler: fn (request, reply):
       reply('hello world')
    end
})

// Start the server
server.start()
say "Server started at port " + port
