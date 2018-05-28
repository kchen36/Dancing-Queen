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
var playBtn = document.getElementById('play');

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

//play button just jumps to next formation
var play = function(){
    for(var i = 0; i < s.children.length; i+=2){
	var x = data[0].formations[1].userMovements[i/2].xcor * 100;
	var y = data[0].formations[1].userMovements[i/2].ycor * 100;
	s.children[i].setAttribute("cx", x);
	s.children[i].setAttribute("cy", y);
	s.children[i+1].setAttribute("x", x);
	s.children[i+1].setAttribute("y", y);
    }
}

playBtn.addEventListener("click", play)



//d3 stuff to replace all this eventually
var body = d3.select(".container");

var svg = body.append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border","1px solid black");

var circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")

var circleAttributes = circles
    .attr("cx", width/2)
    .attr("cy", height/2)
    .attr("r", 30)
    .style("fill", function(d) { console.log(d.users); });
