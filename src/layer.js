var _ = require('./util');
var layerUtil = require('./layerUtil');

var GeneralLayer = require('./layers/general');
var PageLayer = require('./layers/pageLayer');
var ArtboardLayer = require('./layers/artboardLayer');
var TextLayer = require('./layers/textLayer');
var ImageLayer = require('./layers/imageLayer');
var ShapeGroupLayer = require('./layers/shapeGroupLayer');
var PathLayer = require('./layers/pathLayer');
var SymbolMasterLayer = require('./layers/symbolMasterLayer');
var SymbolLayer = require('./layers/symbolLayer');
var GroupLayer = require('./layers/groupLayer');

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
  } else if (type === 'artboard') {
    return new ArtboardLayer(layer);
  } else if (type === 'symbolMaster') {
    return new SymbolMasterLayer(layer);
  } else if (type === 'symbol') {
    return new SymbolLayer(layer);
  } else if (type === 'text') {
    return new TextLayer(layer);
  } else if (type === 'image') {
    return new ImageLayer(layer);
  } else if (_.isContains(['oval', 'rectangle', 'shapePath', 'combinedShape'], type)) {
    return new ShapeGroupLayer(layer);
  } else if (type === 'path') {
    return new PathLayer(layer);
  } else if (type === 'group') {
    return new GroupLayer(layer);
  } else {
    return new GeneralLayer(layer);
  }
};

module.exports = Layer;
