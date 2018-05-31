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

//work in progress
function getWidth(){
	return data[0].stageSize.length * 100;
}

//work in progress
function getHeight(){
	return data[0].stageSize.width * 100;
}

//work in progress
function getUsers(){
	return data[0].users;
}

function getUserStartLocation(user){
	return
}

var svg = null;

//function that sets everything up
//to be run at the beginning
function initialize(){
	svg = d3.select('#svg_id')
		.attr('width',getWidth())
		.attr('height',getHeight());
	for(var i = 0; i < getUsers().length; i++){
		addUser(getUsers()[i],getUserStartLocation(getUsers()[i]));
	}
}

function addUser(user,userMovement){
	svg
		.append('circle')
		.attr('cx',userMovement['xcor'] * 100)
		.attr('cy',userMovement['ycor'] * 100)
		.attr('r',30)
		.style('stroke',user['color'])
		.style('fill',user['color']);
		.append('text')
		.attr('x',userMovement['xcor'] * 100)
		.attr('y',userMovement['ycor'] * 100)
		.attr('text-anchor','middle')
		.style('stroke','black')
		.text(user['username'])
		.attr('id','user');
}

function moveUsers(formation){
	svg.selectAll('#user')
		.each(function(){
			var user = d3.select(this);
			user
				.transition()
				.attr('cx',formation['userMovements'][user.attr('username')])
				.attr('cy',formation['userMovements'][user.attr('username')])
				.delay(formation['timeTillNext'] * 1000);
			});
}
