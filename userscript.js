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
	#justAnotherMenu {
  	color: #f1f1f1;
		min-height:100px;
		min-width:100px;
  	overflow: hidden;
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
  #justAnotherButton{
    width:98%;
		margin:auto;
    padding:0;
		background-color: #001b6e;
		font-weight:600;
  	font-size: 12px;
  	transform: scale(2, 1);
  }
  #justAnotherMenu input {
    background-color: #FFF;
    color: #3b4045;
    padding:0;
    margin:1px;
  }
`,
form:`
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
			<label for="input-Date-2">Color</label>
			<input type="color" name="color" value="#ff0000">
			<input type="range" name="points" min="0" max="10">
		</div>
	</div>
  <div class="flex-container">
    <input type="submit" value="func1">
    <input type="submit" value="func2">
    <input type="submit" value="func3">
    <input type="submit" value="func4">
    <input type="submit" value="func5">
    <input type="submit" value="func6">
  </div>
</form>
`,
toggleBtn:`<button id="justAnotherButton">&uarr;</button>`

};
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
    //The function library can be customized. Method names need to match button names.
  	window.funcLib = {
  		func1: function(param){
      	//Customize Function Here
  			return `Completed Running: ${param}`;
   		 },
   		func2: function(param){
        //Customize Function Here
  			return `Completed Running: ${param}`;
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
  }// END INJECTED JS
  var script = doc.createElement('script');
	script.appendChild(doc.createTextNode('('+ injectedJS +')();'));
	doc.body.appendChild(script);
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


async function loadMenu(doc){
  injectCSS(doc); 
  buildMenu(doc);	
	handleToggle(doc); 
  function runFunction(e) {
      e.preventDefault();
			var formData = getFormData("#justAnotherForm");
    	console.log({formData});	
      var functionName = e.target.value;
    	console.log(`runFunction is calling ${functionName}.`);
			var functionResult = unsafeWindow.funcLib[functionName](functionName);
			console.log({functionResult});
	}
 
	var buttons = doc.querySelectorAll('#justAnotherMenu input[type="submit"]');
	[].forEach.call(buttons, function(el) { 
  	el.addEventListener("click", runFunction) 
  });
	injectJS(doc);

}
'loading' == document.readyState ? 
  console.log("This script is running at document-start time.") : loadMenu(document);
