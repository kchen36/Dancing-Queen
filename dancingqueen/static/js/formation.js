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
	return json['stageSize']['length'] * 100;
}

function getHeight(){
	return json['stageSize']['width'] * 100;
}

var svg = null;

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
		.attr('cx',function(user){return formation['userMovements'][user['username']]['xcor']})
		.attr('cy',function(user){return formation['userMovements'][user['username']]['ycor']})
		.attr('r',30)
		.style('stroke',function(user){return user['color']})
		.style('fill',function(user){return user['color']})
		.attr('id','user')
		.attr('username',function(user){return user['username']})
		.text(function(user){return formation['userTags'][user['username']]});
//		.append('text')
//		.attr('x',formation['userMovements'][user['username']]['xcor'])
//		.attr('y',formation['userMovements'][user['username']]['ycor'])
//		.attr('text-anchor','middle')
//		.style('stroke','black')
}

function moveUsers(formation){
	svg.selectAll('#user')
		.each(function(){
			var user = d3.select(this);
			user
				.text(formation['userTags'][user.attr('username')])
				.transition()
				.attr('cx',formation['userMovements'][user.attr('username')]['xcor'])
				.attr('cy',formation['userMovements'][user.attr('username')]['ycor'])
				.delay(formation['timeTillNext'] * 1000);
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
