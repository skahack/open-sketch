var _ = require('../util');
var layerUtil = require('../layerUtil');
var GeneralLayer = require('./general');

function PathLayer(layer) {
  GeneralLayer.call(this, layer);
}

PathLayer.prototype = Object.create(GeneralLayer.prototype);
PathLayer.prototype.constructor = PathLayer;

PathLayer.prototype.path = function(){
  return "" + this._layer.bezierPath().svgPathAttribute();
};

module.exports = PathLayer;
