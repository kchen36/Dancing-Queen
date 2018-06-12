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

function parseFormationData(data){
    json = JSON.parse(data);
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
	for(var i = 0; i < users.length; i++){
		var username = users[i]['username'];
		var x = formation['userMovements'][username]['xcor'];
		var y = formation['userMovements'][username]['ycor'];
		currentModifications[username] = {};
		currentModifications[username]['xcor'] = x;
		currentModifications[username]['ycor'] = y;
	}
}

//function that sets everything up
//to be run at the beginning
function initialize(){
	svg = d3.select('#svg_id')
		.attr('width',scaleToScreen(getWidth()))
		.attr('height',scaleToScreen(getHeight()))
		.attr('draggable',true);
	svgNode = svg.node();
	svgNode.addEventListener('mousedown',startDragUser);
	svgNode.addEventListener('mousemove',dragUser);
	svgNode.addEventListener('mouseup',stopDragUser);
	svgNode.addEventListener('mouseleave',stopDragUser);
	currentModifications = {};
	currentFormation = json.formations[0];
	addGroup(json['users'],json.formations[0]);
	updateModifications(json['users'],json.formations[0]);
}

var selectedElement = null;

function startDragUser(event){
	if(event.target.getAttribute('id') == 'user'){
		selectedElement = event.target;
	}
}

function dragUser(event){
	if(selectedElement != null){
		event.preventDefault();
		xcor = revScaleToScreen(event.clientX);
		ycor = revScaleToScreen(event.clientY);
		if (!(xcor < 1 || ycor < 1 || xcor > getWidth() - 1 || ycor > getHeight() - 1)){
			user = d3.select(selectedElement)
				.attr('transform','translate(' + event.clientX + ',' + event.clientY + ')');
			tag = svg.selectAll('#tag')
			.filter(function(tag){
				return (tag.attr('username') == user.attr('username'))
			})
			.attr('transform','translate(' + event.clientX + ',' + event.clientY + ')');
			currentModifications[user.attr('username')]['xcor'] = xcor;
			currentModifications[user.attr('username')]['ycor'] = ycor;
		}
	}
}

function stopDragUser(event){
	if(selectedElement != null){
		selectedElement = null
		save();
	}
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
		.style('position','absolute')
		.attr('left','0px')
		.attr('top','0px')
		.attr('transform',
			function(user){
				return 'translate(' +  scaleToScreen(formation['userMovements'][user['username']]['xcor']) + ',' + 
				 scaleToScreen(formation['userMovements'][user['username']]['ycor'] + 1) + ')';
			})
}

var instant = 1;
function moveUsers(formation){
	svg.selectAll('#user')
		.each(function(){
			var user = d3.select(this);
			cx = scaleToScreen(formation['userMovements'][user.attr('username')]['xcor'] + 1);
			cy = scaleToScreen(formation['userMovements'][user.attr('username')]['ycor'] + 1);
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
			y = scaleToScreen(formation['userMovements'][tag.attr('username')]['ycor'] + 1);
			tag
				.html(tag['username'] + ':' + formation['userTags'][tag.attr('username')])
				.transition()
				.attr('transform','translate(' + x + ',' + y + ')')
				.duration(formation['timeTillNext'] * 1000);
			});
}

function switchFormation(formation){
	currentFormation = formation;
	updateModifications(json.users,formation);
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
	if(index >= 0 && index < json['formations'].length){
		json['formations'].splice(index,0,item)
		return true;
	}
	else{
		return false;
	}
}

function save(){
	currentFormation['userMovements'] = currentModifications;
	updateModifications(currentFormation);
}

function updateCurrentFormationDiv(){
}

function btn_previous(){
	if(formationNum > 0){
		formationNum -= 1;
		switchFormation(json['formations'][formationNum]);
	}
}

function btn_del_formation(){
	btn_previous();
	removeSlide(json,formationNum + 1);
}

function btn_play(){
	instant = 0;
	switchFormation(json['formations'][0])
	instant = 1;
	for(var i = 0; i < json['formations'].length; i++){
		switchFormation(json['formations'][i]);
	}
	formationNum = json['formations'].length;
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
	frame['userTags'] = {};
	for(var key in currentFormation['userTags']){
		frame['userTags'][key] = {};
		frame['userTags'][key] = currentFormation['userTags'][key];
	insertSlide(json,formatioNum + 1, frame);
}

function btn_next(){
	if(formationNum < json['formations'][formationNum]){
		formationNum += 1;
		switchFormation(json['formations'][formationNum]);
	}
}

function btn_create(){
	var name = document.getElementById('name').value;
	var tag = document.getElementById('tag').value;
	for(int i = 0; i < json['users'].length; i++){
		if(json['users'][i]['username'] == name){
			return;
		}
	}
	json['users'].push({'username':name,'color':'blue'});
	for(int i = 0; i < json['formations'].length; i++){
		json['formations'][i]['userMovements'][name] = {'xcor':1,'ycor':1};
		json['formations'][i]['userTags'][name] = tag;
	}
	var users = [
}

function btn_update(){
}

function btn_del_circle(){
}
