var _ = require('../util');
var layerUtil = require('../layerUtil');

function GeneralLayer(layer) {
  this._layer = layer;
}

GeneralLayer.prototype.id = function(){
  return '' + this._layer.objectID();
};

GeneralLayer.prototype.shortId = function(){
  return ('' + this._layer.objectID().sha1()).substr(0, 5);
};

GeneralLayer.prototype.dirName = function(){
  return (this.name() + " - " + this.shortId()).replace(new RegExp('/'), ":");
};

GeneralLayer.prototype.name = function(){
  return '' + this._layer.name();
};

GeneralLayer.prototype.className = function(){
  return '' + this._layer.className();
};

GeneralLayer.prototype.stringValue = function(){
  return '' + this._layer.stringValue();
};

GeneralLayer.prototype.layers = function(){
  var re = new Array();
  if (this._layer.layers) {
    re = this._layer.layers();
  }

  return re;
};

GeneralLayer.prototype.setLayers = function(layers){
  this._layers = layers;
};

GeneralLayer.prototype.type = function(){
  return layerUtil.getType(this._layer);
};

GeneralLayer.prototype.bounds = function(){
  var b = this._layer.frame();
  return {
    origin: {
      x: parseFloat(b.x()).toFixed(3),
      y: parseFloat(b.y()).toFixed(3)
    },
    size: {
      width: parseFloat(b.width()).toFixed(3),
      height: parseFloat(b.height()).toFixed(3)
    }
  };
};

GeneralLayer.prototype.styles = function(){
  var re = [];

  if (!this._layer.isVisible()) {
    re.push("display: none");
  }

  var bounds = this.bounds();
  re.push('top: ' + bounds.origin.y + 'px');
  re.push('left: ' + bounds.origin.x + 'px');
  re.push('width: ' + bounds.size.width + 'px');
  re.push('height: ' + bounds.size.height + 'px');

  if (this.className() == "MSShapeGroup" ||
      this.className() == "MSBitmapLayer") {
    re = re.concat(this.cssAttributes());
  }

  if (this.className() == "MSShapeGroup") {
    if (this._layer.hasClippingMask() === 1) {
      re.push('mask: initial;');
    }
  }
  return re;
};

GeneralLayer.prototype.cssAttributes = function(){
  var re = new Array();
  var styles = this._layer.CSSAttributes();

  for (var i = 0; i < styles.length; i++) {
    var s = "" + styles[i];
    if ((new RegExp('^\/\\* .* \\*\/')).test(s) ||
        (new RegExp('^background:')).test(s) ||
        (new RegExp('^border:')).test(s) ||
        (new RegExp('^letter-spacing:')).test(s) ||
        (new RegExp('^box-shadow:')).test(s) || // TODO
        (new RegExp('^transform:')).test(s) || // TODO
        (new RegExp("linear-gradient")).test(s)) {
      continue;
    }
    re.push(s);
  }

  re = re.concat(this.cssBackgrounds());
  re = re.concat(this.cssBorders());

  return re;
};

GeneralLayer.prototype.cssBackgrounds = function(){
  var re = new Array();

  if (this.className() == "MSShapeGroup") {
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
        var image = findImage(this.savedImages, fills[i].image());
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
  } else if (this.className() == "MSBitmapLayer") {
    var image = findImage(this.savedImages, this._layer.image());
    re.push('background-image: url(' + _.imageName(image) + ')');
  }

  return re;
};

GeneralLayer.prototype.cssBorders = function(){
  var re = new Array();

  if (!this._layer.styleGeneric().hasEnabledBorder()) {
    return re;
  }

  var borders = this._layer.style().borders();
  for (var i = 0; i < borders.length; i++) {
    var c = borders[i].color().RGBADictionary();
    var color = SVGColor.colorWithRed_green_blue_alpha(c.r, c.g, c.b, c.a);
    var s = "border: " + borders[i].thickness() + 'px solid ' + color.stringValueWithAlpha(true);
    if (!borders[i].isEnabled()) {
      s += ' none'
    }
    re.push(s);
  }

  return re;
};

GeneralLayer.prototype.images = function(){
  var re = new Array();

  if (this.className() == "MSShapeGroup") {
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
  } else if (this.className() == "MSBitmapLayer") {
    var image = this._layer.image();
    re.push({
      name: _.imageId(image),
      image: image.image()
    });
  }
  return re;
};

GeneralLayer.prototype.setSavedImages = function(images){
  this.savedImages = images;
};

GeneralLayer.prototype.path = function(){
  if (this.className() != "MSShapePathLayer") {
    return "";
  }

  return "" + this._layer.bezierPath().svgPathAttribute();
};

function findImage(savedImages, image) {
  for (var i = 0; i < savedImages.length; i++) {
    if (savedImages[i].name == _.imageId(image)) {
      return savedImages[i];
    }
  }
  return null;
}

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

module.exports = GeneralLayer;
