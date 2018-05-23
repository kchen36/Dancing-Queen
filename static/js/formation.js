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
					"songLength":<songLength>,
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
					"userMovements":{
										"<username>":{
														"xcor":<xcor>,
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
	json = JSON.parse(data);
}
