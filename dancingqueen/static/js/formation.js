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

function parseFormationData(data){
    json = JSON.parse(data);
}

function getWidth(){
	return json['stageSize']['length'] * 100 + 60;
}

function getHeight(){
	return json['stageSize']['width'] * 100 + 60;
} var svg = null;

var formationNum = 0;
//function that sets everything up
//to be run at the beginning
function initialize(){
	svg = d3.select('#svg_id')
		.attr('width',getWidth())
		.attr('height',getHeight());
	addGroup(json['users'],json.formations[0]);
}

function addGroup(users,formation){
	svg
		.selectAll('circle')
		.data(users)
		.enter()
		.append('circle')
		.attr('cx',function(user){return formation['userMovements'][user['username']]['xcor'] * 100 + 30})
		.attr('cy',function(user){return formation['userMovements'][user['username']]['ycor'] * 100 + 30})
		.attr('r',30)
		.style('stroke',function(user){return user['color']})
		.style('fill',function(user){return user['color']})
		.attr('id','user')
		.attr('username',function(user){return user['username']})
		.text(function(user){return formation['userTags'][user['username']]});
}

var instant = 1;
function moveUsers(formation){
	svg.selectAll('#user')
		.each(function(){
			var user = d3.select(this);
			user
				.text(formation['userTags'][user.attr('username')])
				.transition()
				.attr('transform','translate(' + cx + ',' + cy + ')')
				.duration(formation['timeTillNext'] * 1000 * instant);
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
				.duration(formation['timeTillNext'] * 1000 * instant);
			});
}

function removeSlide(json,index){
	return json['formations'].pop(index);
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
	for(var key in currentFormation['userMovements']){
		frame['userMovements'][key] = {};
		frame['userMovements'][key][xcor] //inprogress
	insertSlide(json,formatioNum + 1, frame);
}
