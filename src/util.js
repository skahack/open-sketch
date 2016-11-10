function stripSlashes(t) {
  return t.replace(/\/$/, "");
}

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
  }
};
