// ==UserScript==
// @name Simple Sticky Footer
// @version  1
// @grant    none
// @include       *
// @run-at document-end
// ==/UserScript==
(async function() {
  if (window.top != window.self) { //only run on the parent page, not embedded pages/objects
    /*
     This script is general-use and is designed to run on most websites.
     Since userscripts aren't typically designed for this purpose,
     there is a need for an additional check to make sure it only runs on the main page, and NOT linked media files and iframes.
    */
    return; //do not run on embedded pages/objects.
  } else {
    var injectedForm = document.createElement("form");
    injectedForm.className = "injectedRowFullWidth customResponsiveInjection";
    injectedForm.id = "customResponsiveInjection";
    injectedForm.setAttribute("onsubmit", "return runFunction()");
    document.body.appendChild(injectedForm);

    var globalCspan = 6;
    //columnized module template
    var modules = [{
      cspan: globalCspan,
      content: `
        <div class="injectedRowFullWidth">
          <input class="col-4" type="text" name="a" placeholder="a">
          <input class="col-4" type="text" name="b" placeholder="b">
          <input class="col-4" type="text" name="c" placeholder="c">
        </div>
        <div class="injectedRowFullWidth">
          <input class="col-4" type="number" name="x" placeholder="x">
          <input class="col-4" type="number" name="y" placeholder="y">
          <input class="col-4" type="number" name="z" placeholder="z">
        </div>
    `
    }, {
      cspan: globalCspan,
      content: `
  <input class="col-12" type="submit" value="toggleTextArea" id="textToggle">
  <textarea class="col-12" name="textArea1" id="textArea1"></textarea>
  <input type="submit" value="toggleTextArea" id="injectedModalOverlay">
    `
    }];
    function clearPlacerHolders(){
      var inputs = document.querySelectorAll("#customResponsiveInjection input[type='text'], #customResponsiveInjection input[type='number'],#customResponsiveInjection textarea");
      [].forEach.call(inputs, function(el) {
        el.setAttribute("placeholder", "");
      });
    }
    function runFunction(e) {
      e.preventDefault();
      var formData = getFormData("#customResponsiveInjection");
      var functionName = e.target.value;
      var win;
      try {
        win = unsafeWindow;
      } catch (e) {
        win = window;
      }
      var functionResult;
      //Read back details & assign placeholders to inputs on mouseover
      if (e.type == "mouseover") {
        //Select & reset all text and number inputs
        clearPlacerHolders();
        functionResult = win.funcLib[functionName](false);
      } else {
        //If runFunction was called by an event other than mouseover, then run the function
        functionResult = win.funcLib[functionName](formData);
      }

    }

    function getFormData(formID) {
      var form = document.querySelector(formID);
      var formData = new FormData(form);
      var data = {};
      var it = formData.entries();
      var result = it.next();
      while (!result.done) {
        var pair = result.value;
        data[pair[0]] = pair[1];
        result = it.next();
      }
      return data;
    }

    document.onkeydown = function(e) {
      var injectedMenu = document.querySelector(".customResponsiveInjection");
      var textArea1 = document.querySelector("#textArea1");
      if (e.key == "Escape" && injectedMenu.style.display == "none") {
        injectedMenu.style.display = "block";
      } else if (e.key == "Escape" && textArea1.className != "") {
        var injectedModalOverlay = document.querySelector("#injectedModalOverlay");
        textArea1.className = ""
        injectedModalOverlay.className = "";
      } else if (e.key == "Escape" && textArea1.className == "") {
        injectedMenu.style.display = "none";
      }
    };

    function loadMod(mod) {
      var column = document.createElement("div");
      column.className = `col-${mod.cspan}`;
      column.innerHTML = mod.content;
      var row = document.querySelector(".customResponsiveInjection");
      row.append(column)
    };

    modules.forEach(loadMod);

    //Append Script to body tag
    function injectJS() {
      //BEGIN INJECTED JS
      function injectedJS() {

        function cleanStr(str) {
          return str.trim();
        }

        function listToArray(settings) {
          var list = settings.list;
          var tests = [",", "\t", "\n"].reduce(function(tests, testStr) {
            if (list.indexOf(testStr) > -1) {
              tests.push(testStr);
            }
            return tests;
          }, []);
          if (tests.length == 1) { //if only one test passes, then split by that character.
            return list.split(tests[0]).map(cleanStr);
          } else if (tests.length == 2) { //since two tests passed, assume rows are split by new lines, and the other passing test splits columns
            return list.split(tests[1]).map(function(row) {
              return row.split(tests[0]).map(cleanStr);
            });
          } else if (tests.length == 3) { //assume the input is tab delimited if all three tests pass.
            return list.split("\n").map(function(row) {
              return row.split("\t").map(cleanStr);
            });
          } else {
            return list;
          }
        }

        function openInNewTab(url) {
          try {
            if (cleanStr(url).indexOf("http") == 0) {
              var win = window.open(url, '_blank');
              return true;
            } else {
              alert("URL not recognized.")
            }
          } catch (e) {
            alert("Error Trying To Open URL on new Tab. Did you put the URL in the text field?")
          }
        }
        function getNodeText(el){
          var el = document.querySelector(el);
          return el.innerText || "";
        }

        function getSentences(str,settings){
          return str.replace(/\[[\w\d!\?\.\s]*\]/gi, " ")
            .replace(/[\n\r\t]+/gim, "[punct]")
            .replace(/!+\?+|\?+!+/gim, "!?[punct]")
            .replace(/!+/gim, "![punct]")
            .replace(/e\.g\.?/gim, "eg")
            .replace(/u\.s\.?/gim, "US")
            .replace(/\(c\./gim, "(c")
            .replace(/ c\./gim, " c")
            .replace(/e\.g\.?/gim, "eg")
            .replace(/\.(?!\s+\w)/gim, "[dot]")
            .replace(/\.+/gim, ".[punct]")
            .replace(/\[dot\]/gim, ".")
            .replace(/\?+/gim, "?[punct]")
            .replace(/\s+/gim, " ")
            .split("[punct]")
            .filter(str => str.length < settings.maxLength && str.length > settings.minLength && str.split(" ").length >= settings.minWordCount)
            .map(str => str.replace(/^\W+/i, "").trim());
        }

        function getHelp(inputs) {
          //update ui to provide feedback - what does the function expect? Which inputs are mapped to each controlled variable?
          Object.keys(inputs).forEach(function(key) {
            var input = document.querySelector(`#customResponsiveInjection *[name='${key}']`);
            var nestObjectKey = Object.keys(inputs[key])[0];
            input.setAttribute("placeholder", `${nestObjectKey} = ${inputs[key][nestObjectKey]}`)
          });
          return null;
        }

        function updateDisplay(selector,str){
          var inputTextArea1 = document.getElementById(selector);
          inputTextArea1.value = str;
        };

        //Override function defaults if UI inputs are provided.

        function mapInputsToSettings(inputs,formData) {
          return Object.keys(inputs).reduce(function(settings,inputKey) {
            if(inputs[inputKey]){
                var vKey = Object.keys(inputs[inputKey])[0];
                if(vKey){
                  if(formData[inputKey]){
                      settings[vKey] = formData[inputKey];
                  }else{
                  settings[vKey] = inputs[inputKey][vKey];
                }}
              }

            return settings;
          },{})
        }

        //The function library can be customized. Method names need to match button names.
        window.funcLib = {
          toggleTextArea: function toggleTextArea(formData) {
            if (!formData) {
              return null;
            };
            var textArea1 = document.querySelector("#textArea1");
            var injectedModalOverlay = document.querySelector("#injectedModalOverlay");
            if (textArea1.className == "injectedModalTextArea") {
              textArea1.className = ""
              injectedModalOverlay.className = "";
            } else {
              textArea1.className = "injectedModalTextArea"
              injectedModalOverlay.className = "customInjectedShow";
            }
            return false;
          },
          processList: function(formData) {
            var inputs = {
              textArea1: {
                list: "https://google.com?q=yoyo\nhttps://duckduckgo.com?q=yoyo"
              }
            }
            if (!formData) { return getHelp(inputs) };
            var settings = mapInputsToSettings(inputs,formData);
            //Customize Function Here

            return listToArray(settings);
          },
          openURL: function(formData) {
            var inputs = {
              a: {
                url: "https://duckduckgo.com?q=yoyo"
              }
            }
            if (!formData) { return getHelp(inputs) };
            var settings = mapInputsToSettings(inputs,formData);
            //Customize Function Here
            openInNewTab(settings.url);
          },
          extractSentences: async function(formData) {
            /* 1) map each property to an input (Dynamic Module Input Mapping - allow UI control of injected JavaScript functions).
               2) The nested object provides data for the placeholder (Dynamic UI feedback - get help on mouseover)
               3) the nested object values can be used as default values for demo/tests of the module.
               4) The input mapper will only replace the inputs that contain values from the UI
            */
            var inputs = {
              x: {minWordCount:4},
              y: {minLength: 80},
              z: {maxLength: 160}
            }
            if (!formData) { return getHelp(inputs) };
            //Customize Function Here
            var settings = mapInputsToSettings(inputs,formData);
            var text = getNodeText("body");
            var sentences = getSentences(text, settings);
            var sentenceListStr = sentences.join("\n");
            updateDisplay("textArea1",sentenceListStr);
          },
          func5: function(formData) {
            //update ui to provide feedback - what does the function expect? Which inputs are mapped to each controlled variable?
            var inputs = {
              a: {
                url: "https://duckduckgo.com"
              },
              b: {
                param: "p=2"
              },
              c: {
                param: "q=yoyo"
              },
              x: {
                length: 10
              },
              y: {
                width: 10
              },
              z: {
                height: 10
              },
            }
            if (!formData) {
              return getHelp(inputs)
            };
            var settings = mapInputsToSettings(inputs,formData);
            //Customize Function Here
            return `Completed Running: ${formData}`;
          },
          func6: function(formData) {
            if (!formData) {
              return "starter function template"
            };
            //Customize Function Here
            return `Completed Running: ${formData}`;
          }
        };
        window.funcLib.listToTabs = function(formData) {
          var inputs = {
            textArea1: {
              list: "https://google.com?q=yoyo\nhttps://duckduckgo.com?q=yoyo"
            },
          }
          if (!formData) {
            return getHelp(inputs)
          };
          var list = window.funcLib.processList(formData);
          list.forEach(openInNewTab);
        }
      } // END INJECTED JS

      //START THE SCRIPT
      var script = document.createElement('script');
      script.appendChild(document.createTextNode('(' + injectedJS + ')();'));
      document.body.appendChild(script);
      var win;
      try {
        win = unsafeWindow;
      } catch (e) {
        win = window;
      }
      var column = document.createElement("div");
      column.className = `col-12 taskButtons`;
      //reduce function library keys to a string of buttons
      column.innerHTML = Object.keys(win.funcLib)
        .reduce(function(str, key) {
          //The textarea Toggle button is added manually, above the textarea, so skip it.
          //Any function in the funcLib can be skipped here, and a button will NOT be added to the menu
          if (key != "toggleTextArea") {
            str += `<input class='col-2' type="submit" value="${key}">`;
          }
          return str;
        }, "");
      var row = document.querySelector(".customResponsiveInjection");
      row.append(column)
    }

    var css = `<style>
.customResponsiveInjection, .customResponsiveInjection * {
  all:revert;
  box-sizing: border-box;
  margin:0px !important;
  padding:0px !important;
  border:0px !important;
  outline:0px !important;
  display:block;
  width:unset;
  min-width:unset;
  max-width:unset;
  height:unset;
  min-height:unset;
  max-height:unset;
}
.customResponsiveInjection .injectedRowFullWidth{
  width:100%;
}
.customResponsiveInjection .row::after {
  content: "";
  clear: both;
  display: table;
}
.customResponsiveInjection{
  position: fixed;
  z-index:999999999;
  bottom:0;
  left:0;
  padding:2px;
  background: rgba(0,0,0,0.5);
  color: #f1f1f1;
  min-height:5px;
  width:100%;
  font-size:12px !important;
}
.customResponsiveInjection::after {
  content: "";
  clear: both;
  display: table;
}

/* Collapse Columns For Small Screens */
.customResponsiveInjection [class*="col-"] {
  width: 100%;
  min-height:30px;
  max-height:200px;
  float: left;
}
/*Allow 12 column grid per row on Large screens: */
@media only screen and (min-width: 600px) {
 .customResponsiveInjection .col-1 {width: 8.33%;}
 .customResponsiveInjection .col-2 {width: 16.66%;}
 .customResponsiveInjection .col-3 {width: 25%;}
 .customResponsiveInjection .col-4 {width: 33.33%;}
 .customResponsiveInjection .col-5 {width: 41.66%;}
 .customResponsiveInjection .col-6 {width: 50%;}
 .customResponsiveInjection .col-7 {width: 58.33%;}
 .customResponsiveInjection .col-8 {width: 66.66%;}
 .customResponsiveInjection .col-9 {width: 75%;}
 .customResponsiveInjection .col-10 {width: 83.33%;}
 .customResponsiveInjection .col-11 {width: 91.66%;}
 .customResponsiveInjection .col-12 {width: 100%;}
}
.customResponsiveInjection input{
  max-width:100%;
  min-width:25%;
  margin:0;
  padding:0;
  outline: 1px solid gray;
  outline-offset: -1px;
  border:0;

}
.customResponsiveInjection input[type="submit"], .customResponsiveInjection input[type="button"] {
  min-width: 10%;
  color: #FFF;
  background-color: #0095ff;
  display:block;
  text-align:center;
  margin:auto;
  outline: 1px solid black;
  outline-offset: -1px;
  border:0;

}
.customResponsiveInjection input[type="submit"]:hover, .customResponsiveInjection input[type="button"]:hover {
  background-color: #40b0ff;
  border:1px #FFFFFF solid;
}
.customResponsiveInjection textarea{
  width:100%;
  min-height:50px;
  resize:none;
  overflow:auto;
}
.injectedModalTextArea{
  position:fixed;
  top:0;
  left:0;
  z-index: 999999999;
  margin:2%;
  width:90vw;
  height:90vh;
  min-width:90vw;
  min-height:90vh;
  max-width:90vw;
  max-height:90vh;
}
#injectedModalOverlay{
  position:fixed;
  top:0;
  left:0;
  z-index: 99999999;
  margin:0;
  padding:0;
  width:100vw;
  height:100vh;
  background-color:#000000;
  color:#000000;
  display:none;
  border:0px #000000 solid !important;
}
.customInjectedShow{
 display:block !important;
 border:0;
}
.customInjectedShow:hover{
   border:0px #000000 solid !important;
 background-color:#000000 !important;
}
.taskButtons input{
  max-width:33%;
  min-width:25%;
  display: initial !important;
}
</style>
`
    function injectCSS(doc) {
      var style = document.createElement("style");
      style.innerHTML = css;
      document.head.appendChild(style);
    }
    injectJS();
    injectCSS(document);
    var buttons = document.querySelectorAll('#customResponsiveInjection input[type="submit"]');
    [].forEach.call(buttons, function(el) {
      el.addEventListener("click", runFunction)
      el.addEventListener("mouseover", runFunction)
    });
    var injectedDivOverlay = document.querySelector("#injectedModalOverlay");
    injectedDivOverlay.addEventListener("click", runFunction)
  }
})()
