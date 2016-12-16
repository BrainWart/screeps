var roles = {
	harvester : require("roleHarvester"),
	spawner : require("roleSpawner"),
	upgrader : require("roleUpgrader"),
	builder : require("roleBuilder")
}

module.exports.loop = function() {
	{ // SPAWN NEW CREEPS
		var creepCounts = {}
		
		for (var r in roles) {
			if (roles[r].minimum > 0) {
				creepCounts[r] = 0;
			}
		}

		for (var cn in Game.creeps) {
			var role = Memory.creeps[cn].role;
			if (role) {
				creepCounts[role]++;
			} else {
				console.log(cn + " seems to have no role?");
			}
		}

		for (var n in Game.spawns) {
			var spawn = Game.spawns[n];
			
			var furthest = undefined;
			for (var role in creepCounts) {
				if (creepCounts[role] < roles[role].minimum && (spawn.canCreateCreep(roles[role].body) == OK)) {
					if (furthest && (Math.abs(roles[furthest].minimum - creepCounts[furthest])
							> Math.abs(roles[role].minimum - creepCounts[role]))) {
						furthest = role;
					}
				}
			}
			if (furthest && roles[furthest].minimum > 0) {
				spawn.createCreep(roles[furthest].body, undefined, {"role": furthest, "working": false});
				console.log("new " + furthest);
			}
		}
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
