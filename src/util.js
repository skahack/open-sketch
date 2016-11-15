function stripSlashes(t) {
  return t.replace(/\/$/, "");
}

var blurMap = {
  0: 'gaussian',
  1: 'motion',
  2: 'zoom',
  3: 'background',
};

var booleanOperationMap = {
  0: 'union',
  1: 'subtract',
  2: 'intersect',
  3: 'difference'
};

var blendModeMap = {
  0: 'normal',
  1: 'darken',
  2: 'multiply',
  3: 'colorBurn',
  4: 'lighten',
  5: 'screen',
  6: 'colorDodge',
  7: 'overlay',
  8: 'softLight',
  9: 'hardLight',
  10: 'difference',
  11: 'exclusion',
  12: 'hue',
  13: 'saturation',
  14: 'color',
  15: 'lumiosity'
};

module.exports = {
  log: function(){
    var t = Array.prototype.slice.call(arguments);
    print(t.join(" "));
  },

  isNull: function(obj){
    return obj == null || Object.prototype.toString.call(obj) == '[object Null]';
  },

  toArray: function(t){
    for (var n = t.count(), r = [], e = 0; n > e; e++) {
      r.push(t.objectAtIndex(e));
    }
    return r;
  },

  joinPath: function(){
    return Array.prototype.slice.call(arguments).map(stripSlashes).join("/");
  },

  getJSON: function(t){
    return JSON.stringify(t, null, "  ");
  },

  dataToHexdecimal: function(data){
    return data.sha1AsString();
  },

  sha1: function(str){
    var s = NSString.alloc().initWithString(str);
    return s.sha1();
  },

  /**
   * @see sketch.js saveImages
   */
  imageName: function(image) {
    return image.sha1.substr(0,7) + '.png';
  },

  /**
   * @param {MSImageData} image
   */
  imageId: function(image) {
    return '' + image.sha1().sha1AsString();
  },

  system: function(path, args){
    if (!args) {
      args = [];
    }
    var task = NSTask.alloc().init();
    task.launchPath = path;
    task.arguments = args;
    var stdout = NSPipe.pipe();
    task.standardOutput = stdout;
    task.launch();
    task.waitUntilExit();
    var data = stdout.fileHandleForReading().readDataToEndOfFile();

    return NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding);
  },

  shasum: function(path) {
    var out = '' + this.system('/usr/bin/shasum', [path]);
    return out.substr(0, 40);
  },

  /**
   * @param {MSColor} color
   */
  colorToString: function(color) {
    var c = color.RGBADictionary();
    var color = MSImmutableColor.colorWithRed_green_blue_alpha(c.r, c.g, c.b, c.a);
    return '' + color.stringValueWithAlpha(true);
  },

  stringToColor: function(str) {
    return MSImmutableColor.colorWithSVGString(str);
  },

  isContains: function(array, item) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === item) {
        return true;
      }
    }
    return false;
  },

  booleanOperationToNumber: function(str) {
    var keys = Object.keys(booleanOperationMap);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (booleanOperationMap[key] === str) {
        return i;
      }
    }
    throw new Error('Unknow booleanOperation type. type=' + str);
  },

  blurTypeToString: function(num) {
    if (blurMap[num]) {
      return blurMap[num];
    }
    throw new Error('Unknow blur type. type=' + str);
  },

  blurTypeToNumber: function(str) {
    var keys = Object.keys(blurMap);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (blurMap[key] === str) {
        return i;
      }
    }
    throw new Error('Unknow blur type. type=' + str);
  },

  blendModeNumberToString: function(num) {
    if (blendModeMap[num]) {
      return blendModeMap[num];
    }
    throw new Error('Unknow blendMode type. type=' + num);
  },

  blendModeToNumber: function(str) {
    var keys = Object.keys(blendModeMap);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (blendModeMap[key] === str) {
        return i;
      }
    }
    throw new Error('Unknow blendMode type. type=' + str);
  }
};
