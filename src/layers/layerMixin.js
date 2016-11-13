var _ = require('../util');

module.exports = {
  exportBlur: function() {
    var re = new Array();
    if (!this._layer.styleGeneric) {
      return re;
    }

    var blur = this._layer.styleGeneric().blur();
    if (blur.isEnabled()) {
      var rad = blur.radius();
      var angle = blur.motionAngle();
      var type = _.blurTypeToString(blur.type());

      if (_.isContains(['gaussian', 'background'], type)) {
        re.push('filter: ' + type + '-blur(' + rad + 'px)');
      } else {
        re.push('filter: ' + type + '-blur(' + rad + 'px ' + angle + 'deg)');
      }
    }
    return re;
  }
};
