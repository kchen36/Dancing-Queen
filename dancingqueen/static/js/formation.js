/*
  takes a json with formation data as input and loads data
  this was written with knowledge that each tab is 4 spaces

  the json is formatted like this:
  {
  "pieceName":"<pieceName>",
  "stageSize":{
  "length":<length>,
  "width" :<width>,
  },
  "songInfo":{
  "songName"  :"<songName>",
  "songLength":<song length in seconds>,
  },
  "users":[
  {
  "username":"<username>",
  "color"   :"<color>",
  },
  {
  ...
  },
  ...
  ],
  "formations":[
  {
  "timeTillNext" :<seconds till next frame>,
  "userMovements":{ "<username>":{ "xcor":<xcor>,
  "ycor":<ycor>,
  }
  ...
  },
  "userTags"     :{
  "<username>":"tag",
  ...
  },
  },
  ...
  ],
  }
*/

/*

  old code moved to formation.js.old
  this is the new one that will be rewritten 
  using d3

*/

var json = null;
var currentFormation = null;
var currentModifications = null;
var nameInput = document.getElementById('name');
var tagInput = document.getElementById('tag');
var data = document.getElementById('data').getAttribute('value')

function parseFormationData(data){
    json = JSON.parse(data);
}

function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}

function getWidth(){
    return json['stageSize']['length'] + 2;
}

function getHeight(){
    return json['stageSize']['width'] + 2;
} 

var svg = null;

var formationNum = 0;
function getScreenSize(){
    x = screen.height;
    y = screen.height;
    return [x,y];
}

function scaleToScreen(n){
    var size = getScreenSize();
    var ratio = size[0] / getWidth();
    if(getHeight() * ratio > size[1]){
	ratio = size[0] / getHeight();
    }
    return ratio * n;
}

function revScaleToScreen(n){
    var ratio = scaleToScreen(1);
    return n / ratio;
}

function updateModifications(users,formation){
	return
}

//function that sets everything up
//to be run at the beginning
var offSetX = null;
var offSetY = null;
function initialize(){
	var df = d3.select('#data').node();
    parseFormationData(df.value);
    svg = d3.select('#svg_id')
    parseFormationData(data);
    svg = d3.select('#svg_id');
    var offSet = getOffset(svg.node());
    offSetX = offSet.left;
    offSetY = offSet.top;
    svg
	.attr('width',scaleToScreen(getWidth()))
	.attr('height',scaleToScreen(getHeight()))
	.attr('draggable',true);
    svgNode = svg.node();
    svgNode.addEventListener('click',startDragUser);
    svgNode.addEventListener('mousemove',dragUser);
    currentModifications = {};
    currentFormation = json.formations[0];
    addGroup(json['users'],json.formations[0]);
    updateModifications(json['users'],json.formations[0]);
}

var selectedElement = null;
var dragOn = false;

function startDragUser(event){
	if(dragOn){
		stopDragUser();
		dragOn = false;
	}
	else{
		if(event.target.getAttribute('id') == 'user'){
		selectedElement = event.target;
		dragOn = true;
		}
	}
}

function dragUser(event){
    if(selectedElement != null){
		event.preventDefault();
		xcor = revScaleToScreen(event.clientX - offSetX);
		ycor = revScaleToScreen(event.clientY - offSetY);
		if (!(xcor < 1 || ycor < 1 || xcor > getWidth() - 1 || ycor > getHeight() - 1)){
			user = d3.select(selectedElement)
			.attr('transform','translate(' + (event.clientX - offSetX) + ',' + (event.clientY - offSetY) + ')');
		    tag = svg.selectAll('#tag')
			.filter(function(t){
	 		    return (t['username'] == user.attr('username'))
			})
			.attr('transform','translate(' + (event.clientX - offSetX) + ',' + (event.clientY - offSetY) + ')');
			currentFormation['userMovements'][user.attr('username')]['xcor'] = xcor;
			currentFormation['userMovements'][user.attr('username')]['ycor'] = ycor;
		}
    }
}

function stopDragUser(event){
	selectedElement = null
}

function addGroup(users,formation){
    svg
	.selectAll('circle')
	.data(users)
	.enter()
	.append('circle')
	.attr('draggable',true)
	.attr('cx',0)
	.attr('cy',0)
	.attr('transform',
	      function(user){
			console.log('adding');
			console.log(user);
		  return 'translate(' + 
		      scaleToScreen(formation['userMovements'][user['username']]['xcor'] + 1)
		      + ',' + 
		      scaleToScreen(formation['userMovements'][user['username']]['ycor'] + 1)
		      + ')';
	      })
	.attr('r',scaleToScreen(0.5))
	.style('stroke',function(user){return user['color']})
	.style('fill',function(user){return user['color']})
	.attr('id','user')
	.attr('username',function(user){return user['username']});
    svg
	.selectAll('text')
	.data(users)
	.enter()
	.append('text')
	.style('stroke','black')
	.style('fill','black')
	.attr('id','tag')
	.attr('username',function(user){return user['username'];})
	.html(
	    function(user){
		var header = user['username'] + ':';
		return header + formation['userTags'][user['username']];
	    })
	.attr('transform',
	      function(user){
		  return 'translate(' +  scaleToScreen(formation['userMovements'][user['username']]['xcor']) + ',' + 
		      scaleToScreen(formation['userMovements'][user['username']]['ycor']) + ')';
	      })
}

var instant = 1;
function moveUsers(formation){
    svg.selectAll('#user')
	.each(function(){
	    var user = d3.select(this);
		console.log(this)
	    cx = scaleToScreen(formation['userMovements'][user.attr('username')]['xcor'] );
	    cy = scaleToScreen(formation['userMovements'][user.attr('username')]['ycor'] );
		console.log("move:" + cx + ' ' + cy);
	    user
		.text(formation['userTags'][user.attr('username')])
		.transition()
		.attr('transform','translate(' + cx + ',' + cy + ')')
		.duration(formation['timeTillNext'] * 1000);
	});
    svg.selectAll('#tag')
	.each(function(){
	    var tag = d3.select(this);
	    x = scaleToScreen(formation['userMovements'][tag.attr('username')]['xcor']);
	    y = scaleToScreen(formation['userMovements'][tag.attr('username')]['ycor']);
	    tag
		.html(tag['username'] + ':' + formation['userTags'][tag.attr('username')])
		.transition()
		.attr('transform','translate(' + x + ',' + y + ')')
		.duration(formation['timeTillNext'] * 1000);
	});
}

function switchFormation(formation){
	save();
    currentFormation = formation;
    moveUsers(formation);
}

function removeSlide(json,index){
    if(currentFormation == json['formations'][index]){
	return null;
    }
    else{
	return json['formations'].pop(index);
    }
}

function insertSlide(json,index,item){
    if(index >= 0 && index <= json['formations'].length){
	json['formations'].splice(index,0,item)
	return true;
    }
    else{
	return false;
    }
}

function save(){
	return
}

function updateCurrentFormationDiv(){
    var cf = d3.select('#current_formation');
    var s = "";
    for(var i = 0; i < formationNum; i++){
	s = s + i + ' ';
    }
    s = s + '*' + formationNum + '* ';
    for(var i = formationNum + 1; i < json['formations'].length; i++){
	s = s + i + ' ';
    }
    cf.html(s);
}

function btn_previous(){
    instant = 0;
    if(formationNum > 0){
	formationNum -= 1;
	switchFormation(json['formations'][formationNum]);
	instant = 1;
	updateCurrentFormationDiv()
	return true;
    }
    instant = 1;
    updateCurrentFormationDiv()
    return false;
}

function btn_del_formation(){
    if(btn_previous()){
	removeSlide(json,formationNum + 1);
    }
    updateCurrentFormationDiv()
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var interval = null;
function btn_play(){
		interval = setInterval(function(){
			if(!btn_next()){
				clearInterval(interval);
			}
		},1000);
}

function btn_add_formation(){
    var frame = {};
    frame['timeTillNext'] = 1;
    frame['userMovements'] = {};
    var current = currentFormation['userMovements'];
    for(var key in currentFormation['userMovements']){
		frame['userMovements'][key] = {};
		frame['userMovements'][key]['xcor'] = current[key]['xcor'];
		frame['userMovements'][key]['ycor'] = current[key]['ycor'];
    }
	frame['userTags'] = {};
    for(var key in currentFormation['userTags']){
		frame['userTags'][key] = {};
		frame['userTags'][key] = currentFormation['userTags'][key];
	}
	insertSlide(json,formationNum + 1, frame);
	updateCurrentFormationDiv()
} 
function btn_next(){
    instant = 0;
    if(formationNum < json['formations'].length){
		formationNum += 1;
		switchFormation(json['formations'][formationNum]);
		instant = 1;
		updateCurrentFormationDiv()
	return true;
    }
    instant = 1;
    updateCurrentFormationDiv()
    return false;
}

function btn_create(){
    var name = nameInput.value;
    var tag = tagInput.value;
    for(var i = 0; i < json['users'].length; i++){
	if(json['users'][i]['username'] == name){
		return;
		}
    }
    json['users'].push({'username':name,'color':'blue'});
    for(var i = 0; i < json['formations'].length; i++){
		json['formations'][i]['userMovements'][name] = {'xcor':1,'ycor':1};
		json['formations'][i]['userTags'][name] = tag;
    }
    addGroup(json['users'],currentFormation);
}

function btn_update(){
    var tag = currentFormation['userTags'][nameInput.value];
    if(tag != undefined){
	currentFormation['userTags'][nameInput.value] = tagInput.value;
    }
    instant = 0;
    moveUsers(currentFormation);
    instant = 1;
}

function btn_del_circle(){
    var name = nameInput.value;
    for(var i = 0; i < json['users'].length; i++){
	if(json['users'][i]['username'] == name){
	    delete json['users'][i];
	    break;
	}
    }
    for(var i = 0; i < json['formations']; i++){
	delete json['formations']['userMovements'][name];
	delete json['formations']['userTags'][name];
	break;
    }
    svg.selectAll('#user')
	.filter(function(user){return user.attr('username') == name;})
	.node()
	.remove();
    svg.selectAll('#tag')
	.filter(function(tag){return tag.attr('username') == name;})
	.node()
	.remove();
}

function btn_save() {
    var saveinfo = document.getElementById('output');
    saveinfo.setAttribute('value', json);
}

window.onload = initialize();
