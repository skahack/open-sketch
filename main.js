function getFileContents(path) {
  return NSString.stringWithContentsOfFile_encoding_error(path, NSUTF8StringEncoding, nil)
}

function getCurrentPath() {
  return NSProcessInfo.processInfo().arguments()[0].stringByDeletingLastPathComponent();
}

function splitLines(str) {
	return str.match(/[^\r\n]+/g)
}

function getMergedObject() {
  var obj = {},
  i = 0,
  il = arguments.length,
  key;
  for (; i < il; i++) {
    for (key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) {
        obj[key] = arguments[i][key];
      }
    }
  }
  return obj;
};

function main() {
  var appIdentifier = 'com.bohemiancoding.sketch3';
  var pluginSession = "SketchPlugin-" + Date.now();

  print("Running...");

  var origPluginCode = getFileContents('bundle.js');
  origPluginCode = origPluginCode.replace(/%CURRENT_PATH%/, getCurrentPath());

  // Find the Sketch application
  sketch = COScript.applicationForIdentifier(appIdentifier)

  if (!sketch) {
    throw Error("Cannot find Sketch for " + appIdentifier)
  }

  // Parse the output and see what we get
  var pluginCode;
  var log;
  print('Exporting...')
  pluginCode = origPluginCode.replace(/%TYPE%/, 'export');
  log = sketch.delegate().runPluginScript_name(pluginCode, pluginSession);
  print(log)

  print('Importing...')
  pluginCode = origPluginCode.replace(/%TYPE%/, 'import');
  sketch.delegate().openTemplateAtPath(null);
  log = sketch.delegate().runPluginScript_name(pluginCode, pluginSession);
  print(log)
}

main()
