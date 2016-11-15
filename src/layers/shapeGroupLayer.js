var _ = require('../util');
var mixin = require('./layerMixin');
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
    re = re.concat(this.booleanOperation());
    return re;
  }

  re = re.concat(this.cssAttributes());
  re = re.concat(this.blur());
  re = re.concat(this.shadow());
  if (this._layer.hasClippingMask() === 1) {
    re.push('mask: initial;');
  }

  return re;
};

ShapeGroupLayer.prototype.booleanOperation = function(){
  var re = new Array();
  var operationStr = '';
  var operation = this._layer.booleanOperation();
  if (operation < 0) {
    return re;
  }

  if (operation === 0) {
    operationStr = 'union';
  } else if (operation === 1) {
    operationStr = 'subtract';
  } else if (operation === 2) {
    operationStr = 'intersect';
  } else if (operation === 3) {
    operationStr = 'difference';
  }

  re.push('boolean-operation: ' + operationStr);

  return re;
};

ShapeGroupLayer.prototype.blur = mixin.exportBlur;

ShapeGroupLayer.prototype.shadow = mixin.exportShadow;

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
      s = s.replace(/;$/, '');
    } else if (fills[i].fillType() == 1) {
      s = 'background-image: linear-gradient('
        + getGradientString(fills[i].gradient(), fills[i].CSSAttributeString()) + ')';
    } else if (fills[i].fillType() == 4) {
      var image = layerUtil.findImage(this.savedImages, fills[i].image());
      s = 'background-image: url(' +_.imageName(image) + ')';
    }

    if (s) {
      var fillStyle = fills[i].contextSettings();
      var blendMode = fillStyle.blendMode();
      var opacity = fillStyle.opacity();

      if (blendMode > 0) {
        s += ' blend-mode(' + _.blendModeNumberToString(blendMode) + ')';
      }

      if (opacity < 1) {
        s += ' opacity(' + opacity + ')';
      }

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
    var color = s.color();
    res.push(_.colorToString(color) + ' ' + s.position());
  });
  return res.join(', ');
}

module.exports = ShapeGroupLayer;
