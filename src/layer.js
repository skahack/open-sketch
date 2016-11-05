var _ = require('./util');
var layerUtil = require('./layerUtil');

var GeneralLayer = require('./layers/general');
var PageLayer = require('./layers/pageLayer');
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
  if (type === 'page') {
    return new PageLayer(layer);
  } else if (type === 'text') {
    return new TextLayer(layer);
  } else {
    return new GeneralLayer(layer);
  }
};

module.exports = Layer;
