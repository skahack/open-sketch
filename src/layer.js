var _ = require('./util');
var GeneralLayer = require('./layers/general');

function Layer() { }

Layer.getLayers = function(layers){
  var re = new Array();
  for (var i = 0; i < layers.length; i++) {
    re.push(Layer.getLayer(layers[i]));
  }
  return re;
};

Layer.getLayer = function(layer){
  return new GeneralLayer(layer);
};

module.exports = Layer;
