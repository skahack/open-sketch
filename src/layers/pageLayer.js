var GeneralLayer = require('./general');

function PageLayer(layer) {
  GeneralLayer.call(this, layer);
}

PageLayer.prototype = Object.create(GeneralLayer.prototype);
PageLayer.prototype.constructor = PageLayer;

PageLayer.prototype.bounds = function(){
  var b = this._layer.contentBounds();
  return {
    origin: {
      x: parseFloat(b.origin.x).toFixed(3),
      y: parseFloat(b.origin.y).toFixed(3)
    },
    size: {
      width: parseFloat(b.size.width).toFixed(3),
      height: parseFloat(b.size.height).toFixed(3)
    }
  };
};

module.exports = PageLayer;
