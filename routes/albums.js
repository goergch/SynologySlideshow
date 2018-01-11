const express = require('express');

const router = express.Router({mergeParams: true});
const {Validator, ValidationError} = require('express-json-validator-middleware');

const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/photos_schema');
const photostation_adapter = require('../adapter/photostation_adapter');
router.get('/', validate({
  query: validation_schema.Empty,
  body: validation_schema.Empty}), function (req, res, next) {

  photostation_adapter.auth((err,sid)=>{
    photostation_adapter.listAlbums(sid,null, (err,items)=>{
      res.send(items);
    })
  });

});

router.get('/:album_id', validate({
  query: validation_schema.Empty,
  body: validation_schema.Empty}), function (req, res, next) {

  var album_id = req.params['album_id'];
  photostation_adapter.auth((err,sid)=>{
    photostation_adapter.listAlbums(sid,album_id, (err,items)=>{
      res.send(items);
    })
  });

});

router.get('/:album_id/photos', validate({
  query: validation_schema.Empty,
  body: validation_schema.Empty}), function (req, res, next) {

  var album_id = req.params['album_id'];
  photostation_adapter.auth((err,sid)=>{
    photostation_adapter.listPhotos(sid,album_id, (err,items)=>{
      res.send(items);
    })
  });

});

module.exports = router;
