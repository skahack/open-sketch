var _ = require('../util');
var GeneralLayer = require('./general');

function SymbolLayer(layer) {
  GeneralLayer.call(this, layer);
}

SymbolLayer.prototype = Object.create(GeneralLayer.prototype);
SymbolLayer.prototype.constructor = SymbolLayer;

SymbolLayer.prototype.symbolId = function(){
  return ('' + this._layer.symbolID());
};

module.exports = SymbolLayer;
