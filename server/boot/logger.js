var winston = require('winston');
var getIp = require('ipware')().get_ip;

winston.add(winston.transports.File, {
  filename: 'logger.log',
  maxsize: 500000
});

module.exports = function(server) {
  server.use(function(req, res, next) {
    var ipInfo = getIp(req);
    var url = req.url;
    var userAgent = req.headers['user-agent'];
    
    winston.info({request: url, agent: userAgent}, ipInfo);
    next();
  });
};