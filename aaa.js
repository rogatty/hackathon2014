function traverse(o ) {
	for (i in o) {
		if (typeof(o[i])=="object") {
			if(o["id"]){

			}
			traverse(o[i] );
		}
	}
}

$j = <<<JSON
{
"name": "Peter Quill",
	"meta":{
	"type":"character",
		"id":"716143"
},
"children": [
	{
		"name": "Characters",
		"meta":{
			"isType":true,
			"locked" :true
		},
		"children": [
			{
				"name": "Gamora",
				"meta":{
					"relation":"Characters > Friends",
					"type":"character",
					"id":"714605"
				}
			},
			{
				"name": "Rocket",
				"meta":{
					"relation":"Characters > Friends",
					"type":"character",
					"id":"716136"
				}
			},
			{
				"name": "Groot",
				"meta":{
					"relation":"Characters > Friends",
					"type":"character",
					"id":"716129"
				}
			},
			{
				"name": "Arthur Douglas",
				"meta":{
					"relation":"Characters > Friends",
					"type":"character",
					"id":"716130"
				}
			},

			{
				"name": "Nebula",
				"meta":{
					"relation":"Characters > Enemies",
					"type":"character",
					"id":"714606"
				}
			},
			{
				"name": "Ronan",
				"meta":{
					"relation":"Characters > Enemies",
					"type":"character",
					"id":"716128"
				}
			},
			{
				"name": "Thanos",
				"meta":{
					"relation":"Characters > Friends",
					"type":"character",
					"id":"522590"
				}
			}

		]
	},
	{
		"name": "Equipment",
		"meta":{
			"locked" :true
		},
		"children": [
			{
				"name": "Element Gun",
				"meta":{
					"relation":"Equipment > Weapon",
					"type":"weapon",
					"id":"586548"
				}
			},
			{
				"name": "Guardians of the Galaxy: Awesome Mix Vol. 1",
				"meta":{
					"relation":"Equipment > Weapon",
					"type":"weapon",
					"id":"2233"
				}
			},
			{
				"name": "Translator Implant",
				"meta":{
					"relation":"Equipment > Weapon",
					"type":"weapon",
					"id":"750637"
				}
			}
		]
	},
	{
		"name": "Actors",
		"meta":{
			"locked" :true
		},
		"children": [
			{
				"name": "Steve Englehart",
				"meta":{
					"relation":"Actors > Created by",
					"type":"character",
					"id":"35496"
				}
			},
			{
				"name": "Steve Gan",
				"meta":{
					"relation":"Actors > Created by",
					"type":"character",
					"id":"439809"
				}
			}
		]
	}

]
}
JSON