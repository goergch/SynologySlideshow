const express = require('express');

const router = express.Router({mergeParams: true});
const {Validator, ValidationError} = require('express-json-validator-middleware');

const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/photos_schema');
const photostation_adapter = require('../adapter/photostation_adapter');
router.get('/:photo_id', validate({
  query: validation_schema.Empty,
  body: validation_schema.Empty
}), function (req, res, next) {

  var photo_id = req.params['photo_id'];
  photostation_adapter.auth((err, sid) => {
    photostation_adapter.getPhoto(sid, photo_id, (err, data) => {
      if (err) {
        next(err);
        return;
      }

      // if (!data) {
      //   res.sendStatus(404);
      //   return;
      // }

      // res.set('Content-Type', data.contentType);
      // res.pipe(data);
    },res)
  });

});

module.exports = router;
