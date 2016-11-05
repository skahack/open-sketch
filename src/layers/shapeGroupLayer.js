var _ = require('../util');
var layerUtil = require('../layerUtil');
var GeneralLayer = require('./general');

function ShapeGroupLayer(layer) {
  GeneralLayer.call(this, layer);
}

ShapeGroupLayer.prototype = Object.create(GeneralLayer.prototype);
ShapeGroupLayer.prototype.constructor = ShapeGroupLayer;

ShapeGroupLayer.prototype.styles = function(){
  var re = GeneralLayer.prototype.styles.call(this);

  if (this.className() != "MSShapeGroup") {
    return re;
  }

  re = re.concat(this.cssAttributes());
  if (this._layer.hasClippingMask() === 1) {
    re.push('mask: initial;');
  }

  return re;
};

ShapeGroupLayer.prototype.cssBackgrounds = function(){
  var re = new Array();

  if (this.className() != "MSShapeGroup") {
    return re;
  }

  var fills = this._layer.styleGeneric().fills();
  var s;
  for (var i = 0; i < fills.length; i++) {
    s = undefined;

    if (fills[i].fillType() == 0) {
      s = '' + fills[i].CSSAttributeString();
    } else if (fills[i].fillType() == 1) {
      s = 'background-image: linear-gradient('
        + getGradientString(fills[i].gradient(), fills[i].CSSAttributeString()) + ')';
    } else if (fills[i].fillType() == 4) {
      var image = layerUtil.findImage(this.savedImages, fills[i].image());
      s = 'background-image: url(' + _.imageName(image) + ')';
    }

    if (s) {
      s = s.replace(/;$/, '');
      if (!fills[i].isEnabled()) {
        s += ' none';
      }
      re.push(s);
    }
  }

  return re;
};

ShapeGroupLayer.prototype.images = function(){
  var re = new Array();

  if (this.className() != "MSShapeGroup") {
    return re;
  }

  var fills = this._layer.styleGeneric().fills();
  for (var i = 0; i < fills.length; i++) {
    if (fills[i].fillType() == 4) {
      var image = fills[i].image();
      re.push({
        name: _.imageId(image),
        image: image.image()
      });
    }
  }

  return re;
};

/**
 * @param {MSGradient} gradient
 */
function getGradientString(gradient, css) {
  var from = gradient.from();
  var to = gradient.to();

  var res = [];
  res.push(from.x + ' ' + from.y + ' ' + to.x + ' ' + to.y);
  _.toArray(gradient.stops()).forEach(function(s){
    var c = s.color().RGBADictionary();
    var color = SVGColor.colorWithRed_green_blue_alpha(c.r, c.g, c.b, c.a);
    res.push(color.stringValueWithAlpha(true) + ' ' + s.position());
  });
  return res.join(', ');
}

module.exports = ShapeGroupLayer;
