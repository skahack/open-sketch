var _ = require('../util');
var GeneralLayer = require('./general');

function SymbolLayer(layer) {
  GeneralLayer.call(this, layer);
}

SymbolLayer.prototype = Object.create(GeneralLayer.prototype);
SymbolLayer.prototype.constructor = SymbolLayer;

SymbolLayer.prototype.styles = function(){
  var re = GeneralLayer.prototype.styles.call(this);
  re = re.concat(this.background());
  return re;
};

SymbolLayer.prototype.background = function(){
  var re = new Array();

  if (this._layer.hasBackgroundColor()) {
    var bgColor = this._layer.backgroundColor();
    re.push('background: ' + _.colorToString(bgColor));
  }

  return re;
};

module.exports = SymbolLayer;
