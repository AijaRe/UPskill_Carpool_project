// REQUIRE BASE

const app = require ('./app');
const http = require ('http');

 // ======================================================================

 //Start server

var port = process.env.PORT || 3030;
const server = http.createServer(app);
server.listen(port, () => console.log('Server running on port:'+ port));