const express = require('express');

const router = express.Router({mergeParams: true});
const {Validator, ValidationError} = require('express-json-validator-middleware');

const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/photos_schema');
const photostation_adapter = require('../adapter/photostation_adapter');

var globalsid;
var sidDate;
const refreshMilliseconds = 60 * 1000;

var refreshSidAndCallback = function(callback){
  if(globalsid && sidDate && (Date.now()-sidDate) < refreshMilliseconds) {
    callback();
  }else{
    photostation_adapter.auth((err,sid)=>{
      sidDate = Date.now();
      globalsid = sid;
      callback();
    });
  }
}


router.get('/', validate({
  query: validation_schema.Empty,
  body: validation_schema.Empty}), function (req, res, next) {

  var listAlbum = function(){
    photostation_adapter.listAlbums(globalsid,null, (err,items)=>{
      res.send(items);
    })
  };

  refreshSidAndCallback(listAlbum);

});

router.get('/:album_id', validate({
  query: validation_schema.Empty,
  body: validation_schema.Empty}), function (req, res, next) {

  var album_id = req.params['album_id'];

  var getAlbum = function(){
    photostation_adapter.listAlbums(globalsid,album_id, (err,items)=>{
      res.send(items);
    })
  };

  refreshSidAndCallback(getAlbum);

});

router.get('/:album_id/photos', validate({
  query: validation_schema.Empty,
  body: validation_schema.Empty}), function (req, res, next) {

  var album_id = req.params['album_id'];

  var listPhotos = function(){
    photostation_adapter.listPhotos(globalsid,album_id, (err,items)=>{
      res.send(items);
    })
  };

  refreshSidAndCallback(listPhotos);


});

module.exports = router;
