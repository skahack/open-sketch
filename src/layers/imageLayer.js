var _ = require('../util');
var mixin = require('./layerMixin');
var layerUtil = require('../layerUtil');
var GeneralLayer = require('./general');

function ImageLayer(layer) {
  GeneralLayer.call(this, layer);
}

ImageLayer.prototype = Object.create(GeneralLayer.prototype);
ImageLayer.prototype.constructor = ImageLayer;

ImageLayer.prototype.styles = function(){
  var re = GeneralLayer.prototype.styles.call(this);
  re = re.concat(this.cssAttributes());
  re = re.concat(this.blur());
  re = re.concat(this.shadow());
  return re;
};

ImageLayer.prototype.blur = mixin.exportBlur;
ImageLayer.prototype.shadow = mixin.exportShadow;

ImageLayer.prototype.cssBackgrounds = function(){
  var re = new Array();
  var image = layerUtil.findImage(this.savedImages, this._layer.image());
  re.push('background-image: url(' + _.imageName(image) + ')');
  return re;
};

ImageLayer.prototype.images = function(){
  var re = new Array();
  var image = this._layer.image();
  re.push({
    name: _.imageId(image),
    image: image.image()
  });
  return re;
};

module.exports = ImageLayer;
