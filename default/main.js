require("prototype.Creep")();

var roles = {
	harvester : require("role.Harvester"),
	spawner : require("role.Spawner"),
	upgrader : require("role.Upgrader"),
	builder : require("role.Builder")
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
