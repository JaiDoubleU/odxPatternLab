
 var getRandomPlaceholder = function() {
     placeholders = ["i.e. button", "i.e. input-group", "i.e. navbar", "i.e. form", "i.e. panel", "i.e. modal", "i.e. alert", "i.e. messaging", "i.e. field-ticket", "i.e. dashboard", "i.e. color", "i.e. list", "i.e. column"];
     var randomNumber = Math.floor(Math.random() * 3);
     return placeholders[randomNumber];
 }
    /*!
    * Custom Pattern Finder
    *
    * Copyright (c) 2014 Dave Olsen, http://dmolsen.com
    * Licensed under the MIT license
    *
    * @requires url-handler.js
    *
    */

$(document).ready(function() {
    var customPatternFinder = {

            data:   [],
            active: false,

            init: function() {

            for (var patternType in patternPaths) {
                if (patternPaths.hasOwnProperty(patternType)) {
                for (var pattern in patternPaths[patternType]) {
                    var obj = {};
                    obj.patternPartial = patternType+"-"+pattern;
                    obj.patternPath    = patternPaths[patternType][pattern];
                    this.data.push(obj);
                }
                }
            }

            // instantiate the bloodhound suggestion engine
            var customPatterns = new Bloodhound({
                datumTokenizer: function(d) { return Bloodhound.tokenizers.nonword(d.patternPartial); },
                queryTokenizer: Bloodhound.tokenizers.nonword,
                limit: 10,
                local: this.data
            });

            // initialize the bloodhound suggestion engine
            customPatterns.initialize();

            $('#custom-sg-find .typeahead').typeahead({ highlight: true }, {
                displayKey: 'patternPartial',
                source: customPatterns.ttAdapter()
            }).on('typeahead:selected', customPatternFinder.onSelected).on('typeahead:autocompleted', customPatternFinder.onAutocompleted);

            },


            passPath: function(item) {
                // update the iframe via the history api handler
                //patternFinder.closeFinder();
                var obj = JSON.stringify({ "event": "patternLab.updatePath", "path": urlHandler.getFileName(item.patternPartial) });
                var viewportIframe = window.parent.parent;
                //var iframeContentWin = viewportIframe.contentWindow.document;
                viewportIframe.postMessage(obj, urlHandler.targetOrigin);

                var obj = JSON.stringify({ "event": "patternLab.updatePath", "path": urlHandler.getFileName(item.patternPartial) });
                //document.getElementById("sg-viewport").contentWindow.postMessage(obj, urlHandler.targetOrigin);
                window.top.document.getElementById("sg-viewport").contentWindow.postMessage(obj, urlHandler.targetOrigin);
            },

            onSelected: function(e,item) {
                customPatternFinder.passPath(item);
            },

            onAutocompleted: function(e,item) {
                customPatternFinder.passPath(item);
            }
        };

        customPatternFinder.init();

        window.addEventListener("message", customPatternFinder.receiveIframeMessage, false);

        $('#custom-sg-find .typeahead').attr("placeholder", getRandomPlaceholder() );



    });



  // watch the iframe source so that it can be sent back to everyone else.
  function receiveIframeMessage(event) {

    // does the origin sending the message match the current host? if not dev/null the request
    if ((window.location.protocol != "file:") && (event.origin !== window.location.protocol+"//"+window.location.host)) {
      return;
    }

    var path;
    var data = {};
    try {
      data = (typeof event.data !== 'string') ? event.data : JSON.parse(event.data);
    } catch(e) {}

    if ((data.event !== undefined) && (data.event == "patternLab.updatePath")) {

      if (patternData.patternPartial !== undefined) {

        // handle patterns and the view all page
        var re = /(patterns|snapshots)\/(.*)$/;
        path = window.location.protocol+"//"+window.location.host+window.location.pathname.replace(re,'')+data.path+'?'+Date.now();
        window.location.replace(path);

      } else {

        // handle the style guide
        path = window.location.protocol+"//"+window.location.host+window.location.pathname.replace("styleguide\/html\/styleguide.html","")+data.path+'?'+Date.now();
        window.location.replace(path);

      }

    } else if ((data.event !== undefined) && (data.event == "patternLab.reload")) {

      // reload the location if there was a message to do so
      window.location.reload();

    }

  }
  window.addEventListener("message", receiveIframeMessage, false);
