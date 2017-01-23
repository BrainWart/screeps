var roles = {
	harvester : require("roleHarvester"),
	spawner : require("roleSpawner"),
	upgrader : require("roleUpgrader"),
	builder : require("roleBuilder")
}

module.exports.loop = function() {
	{ // SPAWN NEW CREEPS
	}
    
    { // CREEP LOGIC
		for (var cn in Game.creeps) {
			var creep = Game.creeps[cn];

			if (roles[creep.memory.role]) {
				roles[creep.memory.role].run(creep);
			}
		}
	}
}
