module.exports = {
	"roles": {
		"harvester": "role.Harvester",
		"builder": "role.Builder",
		"upgrader": "role.Upgrader",
		"spawner": "role.Spawner"
	},
	// TODO: create an intelligent spawn queue
	//"spawnQueue": ["harvester", "upgrader", "harvester", "spawner", "builder"]
	"spawnQueue": [
		{role:"harvester"},
		{role:"upgrader"},
		{role:"harvester"},
		{role:"spawner"},
		{role:"builder"}
		]
};
