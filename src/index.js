var _ = require('./util');
var File = require('./file');
var Sketch = require('./sketch');

var global = global || {};

function main(type, path) {
  global.path = path;

  _.log(">>> Run", new Date);

  var sketch = new Sketch(path);
  _.log(sketch.getApplicationPath(), sketch.getVersion(), sketch.getBundleVersion());

  var doc = sketch.getActiveDocument();
  _.log("Document:", doc.displayName());

  _.log("path:", path);
  File.createDirectory(_.joinPath(path, 'documents'));

  if (type == 'export') {
    sketch.export();
  } else {
    sketch.import();
  }
}

main('%TYPE%', '%CURRENT_PATH%');
