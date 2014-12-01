var winston = require('winston');
var getIp = require('ipware')().get_ip;

winston.add(winston.transports.File, {
  filename: 'logger.log',
  maxsize: 500000
});

module.exports = function(server) {
  server.use(function(req, res, next) {
    var ipInfo = getIp(req);
    winston.info(ipInfo);
    next();
  });
};