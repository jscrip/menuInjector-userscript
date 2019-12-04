// ==UserScript==
// @name Simple Sticky Footer
// @version  1
// @grant    none
// @include       *
// @run-at document-end
// ==/UserScript==

var settings = {
	css:`
	#justAnotherDiv {
  	all: initial;
	}
	#justAnotherDiv * { box-sizing: border-box; }

	#justAnotherDiv .injectedUIRow {
 	 	padding: 0;
		margin:0;
 	 	display: flex;
	}
	.injectedUIColumn {
		background-color: rgba(0, 0, 0, 0.5);
  	border: 1px solid #fff;
  	padding: 0;
		margin:0;
  	flex-grow: 1;
  	color: #fff;
	}
	#injectedFullWidth {
  	min-width:100%;
		width:100%;
	}
	#justAnotherDiv .flex-container {
  	display: flex;
  	flex-wrap: wrap;
		width:100%;
	}
	#justAnotherDiv input{
		min-width:20px;
		min-height:20px;
	}
	#justAnotherDiv {
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

  #justAnotherButton{
    width:98%;
		margin:auto;
    padding:0;
		background-color: #001b6e;
		font-weight:600;
  	font-size: 12px;
  	transform: scale(2, 1);
  }
	#justAnotherMenu input[type="submit"], #justAnotherButton {
		min-width: 10%;
    color: #FFF;
    background-color: #0095ff;
    display:block;
		text-align:center;
		margin:auto;
		border:1px #000000 solid;
	}
	#justAnotherMenu input[type="submit"]:hover, #justAnotherButton:hover {
    background-color: #40b0ff;
		border:1px #FFFFFF solid;
	}
  #justAnotherMenu input[type="submit"]{
  	padding:4px;
    margin-left:auto;
    margin-right:auto;
    margin-bottom:4px;
  }
  #justAnotherMenu input {
    padding:0;
    margin:1px;
  }
  #justAnotherMenu textarea {
    padding:0;
    margin:1px;
		width:100%;
		height:70%;
  }
/* The Modal (background) */
.justAnotherModal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
.justSomeModalContent {
	background-color: #0095ff;
  margin: auto;
  padding: 2px;
  border: 1px solid #888;
  width: 80%;
	height: 100%;
}
.justSomeModalContent textarea {
  background-color: rgba(25,25,25,0.8);
	color: #FFF;
  margin: 0;
  padding: 0;
  width: 100%;
	height: 100%;
	resize: none;
  overflow: auto;
}
#justAnotherModalBtn{
	width:100%;
	text-align:center;
	margin:auto;
}

`,
modalBtn:`<input type="button" id="justAnotherModalBtn" name="openModal" value="Open Modal">`,
modal:`
<div id="justAnotherModal" class="justAnotherModal">
  <div class="justSomeModalContent">
  </div>
</div>
`,
toggleBtn:`<button id="justAnotherButton">&uarr;</button>`
};
settings.form = `
<form id="justAnotherForm" onsubmit="runFunction()">
	<div class="injectedUIRow">
		<div class="injectedUIColumn">
			<div class="injectedFullWidth">
				<input type="text" id="input-Text-1" name="input-Text-1" placeholder="text input">
			</div>
			<div class="injectedFullWidth">
				<label for="input-Date-1">D1</label>
    		<input type="date" id="input-Date-1" name="input-Date-1">
			</div>
			<div class="injectedFullWidth">
				<label for="input-Date-2">D2</label>
  			<input type="date" id="input-Date-2" name="input-Date-2">
			</div>
		</div>
		<div class="injectedUIColumn">
			<div class="injectedFullWidth">
				<strong>CheckBoxes</strong>
			</div>
			<div class="injectedFullWidth">
				C1<input type="checkbox" name="check1" value="check1">
			</div>
			<div class="injectedFullWidth">
C2<input type="checkbox" name="check2" value="check2">
			</div>
		</div>
		<div class="injectedUIColumn">
                <div class="injectedFullWidth">
                 ${settings.modalBtn}
                </div>
			<textarea id="input-textarea-1" name="input-textarea-1"></textarea>
		</div>
	</div>
  <div id="menuButtonContainer" class="flex-container"></div>
</form>
`;
//Append Styles to head tag
function injectCSS(doc){
	var style = doc.createElement("style");
  style.innerHTML = settings.css;
  doc.head.appendChild(style);
}

//Append Script to body tag
function injectJS(doc){
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
  		processList: function(formData){
      	//Customize Function Here
            var listSelector = formData.find(function(d){return d.key == "input-textarea-1"});
            var list = "";
            if(listSelector){
                list = listSelector.value;
            }
          return listToArray(list);
   		 },
   		openURL: function(formData){
        //Customize Function Here
				var url = formData.find(function(d){return d.key == "input-Text-1"});
				if(url.value){
						url = url.value;
				}
				openInNewTab(url);
  			return true;
    	},
   		func3: function(param){
        //Customize Function Here
  			return `Completed Running: ${param}`;
    	},
   		func4: function(param){
        //Customize Function Here
  			return `Completed Running: ${param}`;
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
  var script = doc.createElement('script');
	script.appendChild(doc.createTextNode('('+ injectedJS +')();'));
	doc.body.appendChild(script);
    var win;
    try{
      win = unsafeWindow;
    }catch(e){
     win = window;
    }
	doc.querySelector("#menuButtonContainer").innerHTML = Object.keys(win.funcLib)
    .reduce(function(str,key){
    	str += `<input type="submit" value="${key}">`;
    	return str;
  },"");
}
//Append Menu to body tag
function buildMenu(doc){
  var menuDock = doc.createElement("div");
  		menuDock.id = "justAnotherDiv";
  		menuDock.innerHTML = `
				${settings.toggleBtn}
				<div id="justAnotherMenu" style="display:none;">
					${settings.form}
				</div>
                ${settings.modal}
				`;
  		doc.body.prepend(menuDock);
}
//show/hide menu
function toggleMenu(doc,toggle){
		var content = doc.querySelector("#justAnotherMenu");
    	if (content.style.display === "grid") {
      	content.style.display = "none";
        toggle.innerHTML = "&uarr;";
    	} else {
     		content.style.display = "grid";
        toggle.innerHTML = "&darr;";
    	};
}
function handleToggle(doc){
  var toggle = doc.querySelector("#justAnotherButton");
  		toggle.addEventListener("click", function() {
    	this.classList.toggle("active");
    	toggleMenu(doc,toggle);
  		});
  doc.onkeydown = function(e){
	 if(e.key == "ArrowUp" || e.key == "ArrowDown"){
     e.preventDefault();
		 toggleMenu(doc,toggle);
	 }
	};
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
function runFunction(e) {
      e.preventDefault();
	  var formData = getFormData("#justAnotherForm");
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

async function loadMenu(){
  var doc = document;
  await injectCSS(doc);
  await buildMenu(doc);
	await handleToggle(doc);
	await injectJS(doc);
  var buttons = await doc.querySelectorAll('#justAnotherMenu input[type="submit"]');
	[].forEach.call(buttons, function(el) {
  	el.addEventListener("click", runFunction)
  });
  console.log("Menu Loaded!");
}
(async function(){
    if(window.top != window.self){

    return;
}else{
 await loadMenu(document);
 var modal = document.getElementById("justAnotherModal");
 var modalBtn = document.getElementById("justAnotherModalBtn");
 var inputTextArea1 = document.getElementById("input-textarea-1");
 var modalTextArea = document.createElement("textarea");
 modal.querySelector(".justSomeModalContent").appendChild(modalTextArea);
 modalBtn.onclick = function() {
   modal.style.display = "block";
	 modalTextArea.value = inputTextArea1.value;
 }
 window.onclick = function(event) {
   if (event.target == modal) {
		 inputTextArea1.value = modalTextArea.value;
		 modalTextArea.value = "";
     modal.style.display = "none";
   }
 }
 document.onkeydown = function(e){
     if(e.key == "Escape"){
			 inputTextArea1.value = modalTextArea.value;
			 modalTextArea.value = "";
       modal.style.display = "none";
     }
 };
}

})()
