var _ = require('./util');
var File = require('./file');
var Layer = require('./layer');
var Importer = require('./importer');

function Sketch(path) {
  this.path = path;
}

Sketch.prototype.getApplication = function(){
  this.app = this.app || NSApplication.sharedApplication();
  return this.app;
};

Sketch.prototype.getApplicationPath = function(){
  return NSBundle.mainBundle().bundlePath();
};

Sketch.prototype.getVersion = function(){
  var t = NSBundle.mainBundle().infoDictionary();
  return t.CFBundleShortVersionString;
};

Sketch.prototype.getBundleVersion = function(){
  var t = NSBundle.mainBundle().infoDictionary();
  return t.CFBundleVersion;
};

Sketch.prototype.getActiveDocument = function(){
  var app = this.getApplication();
  var t = _.toArray(app.orderedDocuments());
  var r = t.filter(function(app){
    return !app.window().isMiniaturized();
  });

  if (r.length > 0) return r[0];
  if (t.length > 0) return t[0];
  throw Error("Could not find open Sketch document");
};

Sketch.prototype.export = function(){
  var doc = this.getActiveDocument();
  var pages = Layer.getLayers(doc.pages());
  var path = _.joinPath(this.path, 'documents');
  _.log("Page length:", pages.length);

  File.removeDirectory(path);
  // export pages
  for (var i = 0; i < pages.length; i++) {
    exportLayer(path, pages[i], pages.length - i, {});
  }
};

Sketch.prototype.import = function(){
  var importer = new Importer(this.getActiveDocument(), this.path);
  importer.import();
};

function exportLayer(path, layer, index, parent) {
  if (parent.type == 'shapePath' && layer.path() === '') {
    return;
  }

  if (parent.type == 'oval' && layer.path() === '') {
    return;
  }

  if (parent.type == 'rectangle' && layer.path() === '') {
    return;
  }

  var path = _.joinPath(path, layer.dirName());
  File.createDirectory(path);

  saveImages(layer, path);

  var json = {
    objectId: layer.id(),
    type: layer.type(),
    className: layer.className(),
    name: layer.name(),
    index: index,
    styles: layer.styles()
  };
  var shapePath = layer.path();
  if (shapePath !== '') {
    json.path = shapePath;
  }
  File.writeFileContents(_.joinPath(path, layer.type() + '.json'), _.getJSON(json));

  var layers = Layer.getLayers(layer.layers());
  layer.setLayers(layers);

  if (layers.length > 0) {
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].className() == 'MSSymbolMaster') { // TODO
        continue;
      }
      exportLayer(path, layers[i], layers.length - i, json);
    }
  }
}

function saveImages(layer, path) {
  var images = layer.images();
  for (var i = 0; i < images.length; i++) {
    var fromPath = _.joinPath(path, images[i].name);
    File.saveImage(fromPath, images[i].image);
    images[i].sha1 = _.shasum(fromPath);
    var toPath = _.joinPath(path, _.imageName(images[i]));
    File.renameFile(fromPath, toPath);
  }
  layer.setSavedImages(images);
}

module.exports = Sketch;
