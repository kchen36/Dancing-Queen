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


function parseFormationData(data){
    //json = JSON.parse(data);
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

var svg = null;

//function that sets everything up
//to be run at the beginning
function initialize(){
	svg = d3.select('#svg_id')
		.attr('width',getWidth())
		.attr('height',getHeight());
	for(var i = 0; i < getUsers().length; i++){
		addUser(getUsers()[i],getFormations()[0].userMovements[i]);
	}
}

function addUser(user,formation){
	svg
		.append('circle')
		.attr('cx',formation.xcor * 100)
		.attr('cy',formation.ycor * 100)
		.attr('r',30)
		.style('stroke',user.color)
		.style('fill',user.color);
		.append('text')
		.attr('x',formation.xcor * 100)
		.attr('y',formation.ycor * 100)
		.attr('text-anchor','middle')
		.style('stroke','black')
		.text(user.username);
}
