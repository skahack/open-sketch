var _ = require('./util');
var layerUtil = require('./layerUtil');

var GeneralLayer = require('./layers/general');
var TextLayer = require('./layers/textLayer');

function Layer() { }

Layer.getLayers = function(layers){
  var re = new Array();
  for (var i = 0; i < layers.length; i++) {
    re.push(Layer.getLayer(layers[i]));
  }
  return re;
};

Layer.getLayer = function(layer){
  var type = layerUtil.getType(layer);
  if (type === 'text') {
    return new TextLayer(layer);
  } else {
    return new GeneralLayer(layer);
  }
};

module.exports = Layer;
