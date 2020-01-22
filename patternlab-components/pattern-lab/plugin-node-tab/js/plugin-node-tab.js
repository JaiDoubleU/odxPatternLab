var PluginTab = {

  /**
   * The function defined as the onready callback within the plugin configuration.
   */
  init: function () {

    //placeholder that will be replaced during configuation
    //most plugins could probably just implement logic here instead.
    /* global Panels */

Panels.add({
  'id': 'sg-panel-css',
  'name': 'CSS',
  'default': false,
  'templateID': 'pl-panel-template-code',
  'httpRequest': true,
  'httpRequestReplace': '.css',
  'httpRequestCompleted': false,
  'prismHighlight': true,
  'language': 'markup',
  'keyCombo': 'ctrl+shift+z'
});

/* global Panels */

Panels.add({
  'id': 'sg-panel-js',
  'name': 'JS',
  'default': false,
  'templateID': 'pl-panel-template-code',
  'httpRequest': true,
  'httpRequestReplace': '.js',
  'httpRequestCompleted': false,
  'prismHighlight': true,
  'language': 'markup',
  'keyCombo': 'ctrl+shift+z'
});



  }
};
