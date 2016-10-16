module.exports = {
  createDirectory: function(path){
    NSFileManager.defaultManager().createDirectoryAtPath_withIntermediateDirectories_attributes_error(path, !0, {}, null);
  },

  readFileContents: function(path){
    return NSString.stringWithContentsOfFile_encoding_error(path, NSUTF8StringEncoding, nil);
  },

  writeFileContents: function(path, str){
    NSString.stringWithString(str).writeToFile_atomically_encoding_error(path, !0, NSUTF8StringEncoding, nil);
  },

  renameFile: function(from, to){
    NSFileManager.defaultManager().moveItemAtPath_toPath_error(from, to, null);
  },

  removeDirectory: function(path){
    NSFileManager.defaultManager().removeItemAtPath_error(path, null);
  },

  /**
   * @param {String} image
   * @param {MSImageData} image
   */
  saveImage: function(path, image){
    var tiffData = image.TIFFRepresentation();
    var p = NSBitmapImageRep.imageRepWithData(tiffData);
    var data = p.representationUsingType_properties(NSPNGFileType, null);
    data.writeToFile_atomically(path, !0);
  },

  jsonFilePaths: function(path){
    var filename;
    var ds = NSFileManager.defaultManager().enumeratorAtPath(path);
    var paths = [];
    while (filename = ds.nextObject()) {
      if (filename.pathExtension() == 'json') {
        paths.push(filename);
      }
    }

    return paths;
  }
};
