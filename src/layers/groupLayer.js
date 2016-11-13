var _ = require('../util');
var GeneralLayer = require('./general');

function GroupLayer(layer) {
  GeneralLayer.call(this, layer);
}

GroupLayer.prototype = Object.create(GeneralLayer.prototype);
GroupLayer.prototype.constructor = GroupLayer;

GroupLayer.prototype.styles = function(){
  var re = GeneralLayer.prototype.styles.call(this);
  re = re.concat(this.cssAttributes());
  return re;
};

module.exports = GroupLayer;
