var _ = require('./util');
var GeneralLayer;

function load() {
  if (!GeneralLayer) {
    GeneralLayer = require('./layers/general');
  }
}

function Layer() { }

Layer.getLayers = function(layers){
  var re = new Array();
  for (var i = 0; i < layers.length; i++) {
    re.push(Layer.getLayer(layers[i]));
  }
  return re;
};

Layer.getLayer = function(layer){
  load();

  return new GeneralLayer(layer);
};

Layer.getType = function(layer){
  var layers = new Array();
  if (layer.layers) {
    layers = _.toArray(layer.layers());
  }

  if (layer.className() == "MSPage") {
    return 'page';
  } else if (layer.className() == "MSArtboardGroup") {
    return 'artboard';
  } else if (layer.className() == "MSLayerGroup") {
    return 'group';
  } else if (layer.className() == "MSTextLayer") {
    return 'text';
  } else if (layer.className() == "MSSliceLayer") {
    return 'slice';
  } else if (layer.className() == "MSBitmapLayer") {
    return 'image';
  } else if (layer.className() == "MSShapeGroup" && layers.length === 1) {
    if (layers[0].className() == "MSOvalShape") {
      return 'oval';
    } else if (layers[0].className() == "MSRectangleShape") {
      return 'rectangle';
    } else if (layers[0].className() == "MSShapePathLayer") {
      return 'shapePath';
    } else {
    }
  } else if (layer.className() == "MSShapeGroup" && layers.length > 1) {
    return 'combinedShape';
  } else if (layer.className() == "MSOvalShape") {
    return 'oval';
  } else if (layer.className() == "MSRectangleShape") {
    return 'rectangle';
  } else if (layer.className() == "MSShapePathLayer") {
    return 'path';
  }
  return 'layer';
};

module.exports = Layer;
