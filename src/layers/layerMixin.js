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
  },

  exportShadow: function() {
    var re = new Array();
    var ss = new Array();

    var shadows = this._layer.style().shadows();
    for (var i = 0; i < shadows.length; i++) {
      var shadow = shadows[i];
      ss.push('' +
        shadow.offsetX() + 'px ' +
        shadow.offsetY() + 'px ' +
        shadow.blurRadius() + 'px ' +
        shadow.spread() + 'px ' +
        _.colorToString(shadow.color()) +
        (shadow.isEnabled() ? '' : ' none'));
    }

    shadows = this._layer.style().innerShadows();
    for (var i = 0; i < shadows.length; i++) {
      var shadow = shadows[i];
      ss.push('inset ' +
        shadow.offsetX() + 'px ' +
        shadow.offsetY() + 'px ' +
        shadow.blurRadius() + 'px ' +
        shadow.spread() + 'px ' +
        _.colorToString(shadow.color()) +
        (shadow.isEnabled() ? '' : ' none'));
    }

    if (ss.length > 0) {
      re.push('box-shadow: ' + ss.join(', '));
    }

    return re;
  }
};
