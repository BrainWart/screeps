module.exports = {
	"roles": {
		"harvester": require("role.Harvester"),
		"builder": require("role.Builder"),
		"upgrader": require("role.Upgrader"),
		"spawner": require("role.Spawner")
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
