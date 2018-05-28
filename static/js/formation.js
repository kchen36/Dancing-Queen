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
function parseFormationData(data){
	//json = JSON.parse(data);
}

var s = document.getElementById('svg_id');

var width = data[0].stageSize.length*100;
var height = data[0].stageSize.width*100 //switched width and length in json test file 
s.setAttribute('width', width);
s.setAttribute('height', height);
var users = data[0].users
;
for (var i = users.length-1; i >= 0; i--) {
	var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	var x = data[0].formations[0].userMovements[i].xcor * 100;
	var y = data[0].formations[0].userMovements[i].ycor * 100;
	circle.setAttribute("cx", x);
	circle.setAttribute("cy", y);
	circle.setAttribute("r", 30);
	circle.setAttribute("stroke", users[i].color);
	circle.setAttribute("fill", users[i].color);
	s.appendChild(circle);

	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", x);
	text.setAttribute("y", y);
	text.setAttribute("text-anchor", "middle");
	text.setAttribute("stroke", "black");
	text.textContent = users[i].username;
	s.appendChild(text);
}
