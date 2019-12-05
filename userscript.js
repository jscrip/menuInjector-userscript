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
    injectedForm.className = "row customResponsiveInjection";
    injectedForm.id = "customResponsiveInjection";
    injectedForm.setAttribute("onsubmit", "return runFunction()");
    document.body.appendChild(injectedForm);

var globalCspan = 6;
//columnized module template
var modules = [
  {
    cspan:globalCspan,
    content:`
        <input class="col-5" type="text" name="t1" placeholder="t1">
        <input class="col-5" type="text" name="t2" placeholder="t2">
        <input class="col-1" type="submit" name="sumbit" value="sumbit">
    `
  },{
    cspan:globalCspan,
    content:`
  <input class="col-12" type="submit" value="toggleTextArea">
  <textarea class="col-12" name="textArea1" id="textArea1"></textarea>
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
  var injectedMenu = document.querySelector("#customResponsiveInjection");
    if(e.key == "Escape" && injectedMenu.style.display == "none"){
      injectedMenu.style.display = "block";
    }else if(e.key == "Escape" && textArea1.className != ""){
      textArea1.className = ""
      toggleTextBtn.value = "Maximize Textarea"
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
  if(textArea1.className == "fullscreen"){
     textArea1.className = ""
     toggleTextBtn.value = "Maximize Textarea";
  }else{
    textArea1.className = "fullscreen"
    toggleTextBtn.value = "Minimize Textarea";
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
				var url = formData.find(function(d){return d.key == "t1"});
				if(url.value){
						url = url.value;
				}
				openInNewTab(url);
  			return true;
    	},
   		extractSentences: async function(formData){
        //Customize Function Here
				var inputSettings = formData.find(function(d){return d.key == "t1"});
				var settings = {
						minWordCount: 4,
						minLength: 30,
						maxLength:130,
					};
				if(inputSettings.value){
					var vals = inputSettings.value.split(",");
					if(vals.length > 0 ){
						var x = +vals[0];
						var y = +vals[1];
						var z = +vals[2];
						if(!isNaN(x)){
							settings.minWordCount = x;
                        }
						if(!isNaN(y)){
							settings.minLength = y;
                        }
						if(!isNaN(z)){
							settings.maxLength = z;
                        }
					}
				}
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
}
.customResponsiveInjection .row{
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
  font-size:16px;
}
.customResponsiveInjection::after {
  content: "";
  clear: both;
  display: table;
}
.customResponsiveInjection ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width:100%;
}
.customResponsiveInjection li {
  padding:0;
  width:96%;
  margin:1%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
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
  width:100%;
  margin:0;
  padding:0;
}
.customResponsiveInjection input[type="submit"], .customResponsiveInjection input[type="button"] {
  min-width: 10%;
  color: #FFF;
  background-color: #0095ff;
  display:block;
  text-align:center;
  margin:auto;
  border:1px #000000 solid;
}
.customResponsiveInjection input[type="submit"]:hover, .customResponsiveInjection input[type="button"]:hover {
  background-color: #40b0ff;
  border:1px #FFFFFF solid;
}
.customResponsiveInjection textarea{
  min-width:90%;
  min-height:50px;
  max-width:90%;
  max-height:50px;
  margin:4px 0 0 0;
  padding:0;

  resize:none;
  overflow:auto;
}
.fullscreen{
  position:fixed;
  top:10%;
  left:10%;
  z-index: 99999999999999999999;
  width:80% !important;
  height:80% !important;
  max-height:80% !important;
  max-width:80% !important;
  min-height:80% !important;
  min-width:80% !important;
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
}
})()
