module.exports = {
	"roles": {
		"harvester": require("role.Harvester"),
		"builder": require("role.Builder"),
		"upgrader": require("role.Upgrader"),
		"spawner": require("role.Spawner")
	},
	"spawnQueue": ["upgrader", "harvester", "harvester", "spawner", "builder"]
};
