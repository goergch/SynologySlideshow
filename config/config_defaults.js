/**
 * Created by beuttlerma on 18.04.17.
 */


var self = {};


// ---- CONFIGURATION EXPORT ----
self.LOG_LEVEL = 'debug';

self.HOST_SETTINGS = {
  PHOTO_STATION: {
    PROTOCOL: 'HTTPS',
    HOST: 'localhost',
    PORT: 443
  }
};

self.PUBLIC_USER = {
  username: '12345',
  password: '12345'
};

module.exports = self;
