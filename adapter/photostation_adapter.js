const self = {};

const https = require('https');

const logger = require('../global/logger');
const CONFIG = require('../config/config_loader');
const request = require('request').defaults({jar: true});


function buildOptionsForRequest(method, protocol, host, port, path, qs) {

  return {
    method: method,
    url: protocol + '://' + host + ':' + port + path,
    qs: qs,
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
}


self.auth = function (callback) {
  if (typeof(callback) !== 'function') {

    callback = function () {
      logger.info('Callback not registered');
    }
  }

  const options = buildOptionsForRequest(
    'POST',
    CONFIG.HOST_SETTINGS.PHOTO_STATION.PROTOCOL,
    CONFIG.HOST_SETTINGS.PHOTO_STATION.HOST,
    CONFIG.HOST_SETTINGS.PHOTO_STATION.PORT,
    '/photo/webapi/auth.php',
    {}
  );

  options.formData = {
    api: 'SYNO.PhotoStation.Auth',
    method: 'login',
    version: '1',
    username: CONFIG.PUBLIC_USER.username,
    password: CONFIG.PUBLIC_USER.password,
    enable_syno_token: 'true'
  };

  request(options, function (e, r, data) {
    var err = logger.logRequestAndResponse(e, options, r, data);
    var sid = null;
    if (!err) {
      if (data && data.success == true && data.data && data.data.sid) {
        sid = data.data.sid;
      } else {
        if (data && data.error && data.error.code) {

          var errorcode = data.error.code;
          err = new Error(errorcode);
        } else {
          err = new Error('Unexpected dataformat');
        }
      }
    }
    callback(err, sid);
  });

};

self.listAlbums = function (sid, album_id, callback) {
  if (typeof(callback) !== 'function') {

    callback = function () {
      logger.info('Callback not registered');
    }
  }

  const options = buildOptionsForRequest(
    'POST',
    CONFIG.HOST_SETTINGS.PHOTO_STATION.PROTOCOL,
    CONFIG.HOST_SETTINGS.PHOTO_STATION.HOST,
    CONFIG.HOST_SETTINGS.PHOTO_STATION.PORT,
    '/photo/webapi/album.php?SynoToken=' + sid,
    {}
  );

  options.formData = {
    sort_by: 'preference',
    sort_direction: 'asc',
    api: 'SYNO.PhotoStation.Album',
    method: 'list',
    version: '1',
    offset: '0',
    limit: '100',
    type: 'album',
  };

  if (album_id) {
    options.formData.id = album_id;
  }

  request(options, function (e, r, data) {
    var err = logger.logRequestAndResponse(e, options, r, data);
    var items = null;
    if (!err) {
      if (data && data.success == true && data.data && data.data.items) {
        items = data.data.items;
      } else {
        if (data && data.error && data.error.code) {

          var errorcode = data.error.code;
          err = new Error(errorcode);
        } else {
          err = new Error('Unexpected dataformat');
        }
      }
    }
    callback(err, items);
  });

};


self.listPhotos = function (sid, album_id, callback) {
  if (typeof(callback) !== 'function') {

    callback = function () {
      logger.info('Callback not registered');
    }
  }

  const options = buildOptionsForRequest(
    'POST',
    CONFIG.HOST_SETTINGS.PHOTO_STATION.PROTOCOL,
    CONFIG.HOST_SETTINGS.PHOTO_STATION.HOST,
    CONFIG.HOST_SETTINGS.PHOTO_STATION.PORT,
    '/photo/webapi/album.php?SynoToken=' + sid,
    {}
  );

  options.formData = {
    sort_by: 'preference',
    sort_direction: 'asc',
    api: 'SYNO.PhotoStation.Album',
    method: 'list',
    version: '1',
    offset: '0',
    limit: '100',
    type: 'photo',
  };

  if (album_id) {
    options.formData.id = album_id;
  }

  request(options, function (e, r, data) {
    var err = logger.logRequestAndResponse(e, options, r, data);
    var items = null;
    if (!err) {
      if (data && data.success == true && data.data && data.data.items) {
        items = data.data.items;
      } else {
        if (data && data.error && data.error.code) {

          var errorcode = data.error.code;
          err = new Error(errorcode);
        } else {
          err = new Error('Unexpected dataformat');
        }
      }
    }
    callback(err, items);
  });

};


self.getPhoto = function (sid, photo_id, callback, res) {
  if (typeof(callback) !== 'function') {

    callback = function () {
      logger.info('Callback not registered');
    }
  }

  const options = buildOptionsForRequest(
    'POST',
    CONFIG.HOST_SETTINGS.PHOTO_STATION.PROTOCOL,
    CONFIG.HOST_SETTINGS.PHOTO_STATION.HOST,
    CONFIG.HOST_SETTINGS.PHOTO_STATION.PORT,
    '/photo/webapi/download.php?SynoToken=' + sid,
    {}
  );

  options.formData = {
    api: 'SYNO.PhotoStation.Download',
    method: 'getphoto',
    version: '1',
    id: photo_id
  };
  options.json = false;

  res.setHeader('Cache-Control', 'public, max-age=' + 60*60*24*7);

  // request.POST(options).
  request(options, function (e, r, imageBuffer) {
    var err = logger.logRequestAndResponse(e, options, r, imageBuffer);
    // console.log(imageBuffer);
    // callback(err, imageBuffer);

  }).pipe(res);

};


self.getThumb = function (sid, photo_id, callback, res) {
  if (typeof(callback) !== 'function') {

    callback = function () {
      logger.info('Callback not registered');
    }
  }

  const options = buildOptionsForRequest(
    'POST',
    CONFIG.HOST_SETTINGS.PHOTO_STATION.PROTOCOL,
    CONFIG.HOST_SETTINGS.PHOTO_STATION.HOST,
    CONFIG.HOST_SETTINGS.PHOTO_STATION.PORT,
    '/photo/webapi/thumb.php?SynoToken=' + sid,
    {}
  );

  options.formData = {
    api: 'SYNO.PhotoStation.Thumb',
    method: 'get',
    version: '1',
    id: photo_id,
    size: 'large'
  };
  options.json = false;

  res.setHeader('Cache-Control', 'public, max-age=' + 60*60*24*7);

  // request.POST(options).
  request(options, function (e, r, imageBuffer) {
    var err = logger.logRequestAndResponse(e, options, r, imageBuffer);
    // console.log(imageBuffer);
    // callback(err, imageBuffer);

  }).pipe(res);

};


module.exports = self;
