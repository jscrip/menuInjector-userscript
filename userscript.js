// ==UserScript==
// @name Simple Sticky Footer
// @version  1
// @grant    none
// @include       *
// @run-at document-end
// ==/UserScript==
(async function(){
    if(window.top != window.self){

    return;
}else{
var injectedForm = document.createElement("form");
    injectedForm.className = "injectedRowFullWidth customResponsiveInjection";
    injectedForm.id = "customResponsiveInjection";
    injectedForm.setAttribute("onsubmit", "return runFunction()");
    document.body.appendChild(injectedForm);

var globalCspan = 6;
//columnized module template
var modules = [
  {
    cspan:globalCspan,
    content:`
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
  },{
    cspan:globalCspan,
    content:`
  <input class="col-12" type="submit" value="toggleTextArea" id="textToggle">
  <textarea class="col-12" name="textArea1" id="textArea1"></textarea>
  <input type="submit" value="toggleTextArea" id="injectedModalOverlay">
    `
  }
];
function runFunction(e) {
    e.preventDefault();
	  var formData = getFormData("#customResponsiveInjection");
      var functionName = e.target.value;
      var win;
    try{
      win = unsafeWindow;
    }catch(e){
     win = window;
    }
	var functionResult = win.funcLib[functionName](formData);
	console.log({functionName,functionResult,formData});
}
function getFormData(formID){
	var form = document.querySelector(formID);
  var formData = new FormData(form);
  var collection = [];
  var it = formData.entries();
 	var result = it.next();
	while (!result.done) {
    var pair = result.value;
 		collection.push({
    	key:pair[0],
      value:pair[1]
    });
 	result = it.next();
	}
  return collection;
}

document.onkeydown = function(e){
  console.log({key:e.key})
  var textArea1 = document.querySelector("#textArea1");
  var toggleTextBtn = document.querySelector("#textToggle");
  var injectedMenu = document.querySelector(".customResponsiveInjection");
  var injectedModalOverlay = document.querySelector("#injectedModalOverlay");

    if(e.key == "Escape" && injectedMenu.style.display == "none"){
      injectedMenu.style.display = "block";
    }else if(e.key == "Escape" && textArea1.className != ""){
      textArea1.className = ""
      injectedModalOverlay.className = "";
    }else if (e.key == "Escape" && textArea1.className == ""){
      injectedMenu.style.display = "none";
    }
};

function loadMod(mod){
  var column = document.createElement("div");
      column.className = `col-${mod.cspan}`;
      column.innerHTML = mod.content;
  var row = document.querySelector(".customResponsiveInjection");
      row.append(column)
};

modules.forEach(loadMod);

//Append Script to body tag
function injectJS(){
  //BEGIN INJECTED JS
  function injectedJS () {

    function cleanStr(str){
        return str.trim();
    }
    function listToArray(list){
        var tests = [",","\t","\n"].reduce(function(tests,testStr){
            if(list.indexOf(testStr) > -1){
               tests.push(testStr);
            }
            return tests;
        },[]);
        if(tests.length == 1){ //if only one test passes, then split by that character.
          return list.split(tests[0]).map(cleanStr);
        }else if(tests.length == 2){ //since two tests passed, assume rows are split by new lines, and the other passing test splits columns
          return list.split(tests[1]).map(function(row){
              return row.split(tests[0]).map(cleanStr);
          });
        }else if(tests.length == 3){ //assume the input is tab delimited if all three tests pass.
          return list.split("\n").map(function(row){
              return row.split("\t").map(cleanStr);
          });
        }else{
            return list;
        }
    }
		function openInNewTab(url) {
			try{
				  if(cleanStr(url).indexOf("http") == 0){
						var win = window.open(url, '_blank');
						return true;
					}else{
						alert("URL not recognized.")
					}

			}catch(e){
				alert("Error Trying To Open URL on new Tab. Did you put the URL in the text field?")
			}


		}
      //The function library can be customized. Method names need to match button names.
  	window.funcLib = {
        toggleTextArea:    function toggleTextArea(){
  var textArea1 = document.querySelector("#textArea1");
  var toggleTextBtn = document.querySelector("#textToggle");
  var injectedModalOverlay = document.querySelector("#injectedModalOverlay");
  if(textArea1.className == "injectedModalTextArea"){
     textArea1.className = ""
     injectedModalOverlay.className = "";
  }else{
    textArea1.className = "injectedModalTextArea"
    injectedModalOverlay.className = "customInjectedShow";
  }
  return false;
},
  		processList: function(formData){
      	//Customize Function Here
            var listSelector = formData.find(function(d){return d.key == "textArea1"});
            var list = "";
            if(listSelector){
                list = listSelector.value;
            }
          return listToArray(list);
   		 },
   		openURL: function(formData){
        //Customize Function Here
				var url = formData.find(function(d){return d.key == "a"});
				if(url.value){
						url = url.value;
				}
				openInNewTab(url);
  			return true;
    	},
   		extractSentences: async function(formData){
        //Customize Function Here
                var inputs = ["x","y","z"];
                var settings = {minWordCount:4,minLength:80,maxLength:160};
				var inputSettings = formData.forEach(function(d){
                    var k = d.key;
                    if(inputs.indexOf(k) > -1){
                       var v = +d.value;
                       if(!isNaN(v) && v != 0){
                        if(k == "x"){
                           settings.minWordCount = v;
                        }else if(k == "y"){
                           settings.minLength = v;
                        }else if(k == "z"){
                           settings.maxLength = v;
                        }
                       }
                    }
                });
                alert(JSON.stringify(settings));
				var sentences = document.body.innerText.replace(/\[[\w\d!\?\.\s]*\]/gi," ")
					.replace(/[\n\r\t]+/gim,"[punct]")
					.replace(/!+\?+|\?+!+/gim,"!?[punct]")
					.replace(/!+/gim,"![punct]")
					.replace(/e\.g\.?/gim,"eg")
					.replace(/u\.s\.?/gim,"US")
					.replace(/\(c\./gim,"(c")
					.replace(/ c\./gim," c")
					.replace(/e\.g\.?/gim,"eg")
					.replace(/\.(?!\s+\w)/gim,"[dot]")
					.replace(/\.+/gim,".[punct]")
					.replace(/\[dot\]/gim,".")
					.replace(/\?+/gim,"?[punct]")
					.replace(/\s+/gim," ")
					.split("[punct]")
					.filter(str => str.length < settings.maxLength && str.length > settings.minLength && str.split(" ").length >= settings.minWordCount)
					.map(str => str.replace(/^\W+/i,"").trim());
				var inputTextArea1 = document.getElementById("textArea1");
				inputTextArea1.value = sentences.join("\n");
    	},
   		func5: function(param){
        //Customize Function Here
  			return `Completed Running: ${param}`;
    	},
   		func6: function(param){
        //Customize Function Here
  			return `Completed Running: ${param}`;
   	 	}
  	};
		window.funcLib.listToTabs = function(formData){
				var list = window.funcLib.processList(formData);
				list.forEach(openInNewTab);
		}
  }// END INJECTED JS
  var script = document.createElement('script');
	script.appendChild(document.createTextNode('('+ injectedJS +')();'));
	document.body.appendChild(script);
    var win;
    try{
      win = unsafeWindow;
    }catch(e){
     win = window;
    }
    var column = document.createElement("div");
        column.className = `col-12 taskButtons`;
        column.innerHTML = Object.keys(win.funcLib)
        .reduce(function(str,key){
          //The textarea Toggle button is added manually, above the textarea, so skip it.
          //Any function in the funcLib can be skipped here, and a button will NOT be added to the menu
          if(key != "toggleTextArea"){
           str += `<input class='col-2' type="submit" value="${key}">`;
          }
          return str;
      },"");
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
  min-width:90%;
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
function injectCSS(doc){
	var style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
}
injectJS();
injectCSS(document);
var buttons = document.querySelectorAll('#customResponsiveInjection input[type="submit"]');
[].forEach.call(buttons, function(el) {
  el.addEventListener("click", runFunction)
});
var injectedDivOverlay = document.querySelector("#injectedModalOverlay");
    injectedDivOverlay.addEventListener("click", runFunction)
}
})()
