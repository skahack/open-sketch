var _ = require('../util');
var GeneralLayer = require('./general');

function ArtboardLayer(layer) {
  GeneralLayer.call(this, layer);
}

ArtboardLayer.prototype = Object.create(GeneralLayer.prototype);
ArtboardLayer.prototype.constructor = ArtboardLayer;

ArtboardLayer.prototype.styles = function(){
  var re = GeneralLayer.prototype.styles.call(this);
  re = re.concat(this.artboardCssBackground());
  return re;
};

ArtboardLayer.prototype.artboardCssBackground = function(){
  var re = new Array();

  if (this._layer.hasBackgroundColor()) {
    var bgColor = this._layer.backgroundColor();
    re.push('background: ' + _.colorToString(bgColor));
  }

  return re;
};

module.exports = ArtboardLayer;
