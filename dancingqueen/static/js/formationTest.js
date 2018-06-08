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

function moveUsers(formation){
	svg.selectAll('#user')
		.each(function(){
			var user = d3.select(this);
			user
				.text(formation['userTags'][user.attr('username')])
				.transition()
				.attr('cx',formation['userMovements'][user.attr('username')]['xcor'] * 100 + 30)
				.attr('cy',formation['userMovements'][user.attr('username')]['ycor'] * 100 + 30)
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
testJson = {
				"pieceName":"testPiece",
				"stageSize":{
								"length":10,
								"width" :5,
							},
				"songInfo" :{
								"songName"  :"abcSong",
								"songLength":300,
							},
				"users"    :[
								{
									"username":"edmond",
									"color"   :"red",
								},
								{
									"username":"kerry",
									"color"   :"blue",
								},
								{
									"username":"fabiha",
									"color"   :"green",
								},
								{
									"username":"philip",
									"color"   :"black",
								},
							],
				"formations":[
								{
									"timeTillNext" :2,
									"userMovements":{
														"edmond":{
																	"xcor":5,
																	"ycor":2.5,
																 },
														"kerry" :{
																	"xcor":0,
																	"ycor":0,
																 },
														"fabiha":{
																	"xcor":2,
																	"ycor":5,
																 },
														"philip":{
																	"xcor":10,
																	"ycor":3,
																 },
													},
									"userTags"     :{
														"edmond":"tag0",
														"kerry" :"tag1",
														"fabiha":"tag with new line\nfor testing",
														"philip":"extra long tag for testing",
													},
								},
								{
									"timeTillNext" :1,
									"userMovements":{
														"edmond":{
																	"xcor":2,
																	"ycor":2,
																 },
														"kerry" :{
																	"xcor":3,
																	"ycor":1,
																 },
														"fabiha":{
																	"xcor":9,
																	"ycor":1,
																 },
														"philip":{
																	"xcor":8,
																	"ycor":5,
																 },
													},
									"userTags"     :{
														"edmond":"second tag0",
														"kerry" :"second tag1",
														"fabiha":"second tag2",
														"philip":"second tag3",
													},
								},

							],
		   };

json = testJson;
initialize()
