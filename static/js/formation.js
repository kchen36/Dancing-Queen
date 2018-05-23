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
	json = JSON.parse(data);
}

//debugging begins here
testJson = {
				"pieceName":"testPiece",
				"stageSize":{
								"length":10
								"width" :5]
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
							],
		   }
