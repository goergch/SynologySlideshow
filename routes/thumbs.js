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
};


router.get('/:photo_id', validate({
  query: validation_schema.Empty,
  body: validation_schema.Empty
}), function (req, res, next) {

  var photo_id = req.params['photo_id'];

  var getThumb = function() {
    photostation_adapter.getThumb(globalsid, photo_id, (err, data) => {
      if (err) {
        next(err);
        return;
      }

    },res)
  };

  refreshSidAndCallback(getThumb);

});

module.exports = router;
