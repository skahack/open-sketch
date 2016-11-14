var _ = require('../util');
var mixin = require('./layerMixin');
var GeneralLayer = require('./general');

function GroupLayer(layer) {
  GeneralLayer.call(this, layer);
}

GroupLayer.prototype = Object.create(GeneralLayer.prototype);
GroupLayer.prototype.constructor = GroupLayer;

GroupLayer.prototype.styles = function(){
  var re = GeneralLayer.prototype.styles.call(this);
  re = re.concat(this.cssAttributes());
  re = re.concat(this.shadow());
  return re;
};

GroupLayer.prototype.shadow = mixin.exportShadow;

module.exports = GroupLayer;
