var roles = {
	harvester : require("roleHarvester"),
	spawner : require("roleSpawner"),
	upgrader : require("roleUpgrader")
}

module.exports.loop = function() {
	for (var r in Game.rooms) {
		var room = Game.rooms[r];
		if (room.controller.level > room.memory.lastLevel ) {
			Game.notify("room ["+room.id+"] has leveled up to "+room.controller.level);
			console.log("room ["+room.id+"] has leveled up to "+room.controller.level);
			room.memory.lastLevel = room.controller.level;
		}
	}
	
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
							> Math.abs(roles[role].minimum - creepCounts[minimum]))) {
						furthest = role;
					}
				}
			}
			if (furthest) {
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
			} else {
				creep.suicide();
			}
		}
	}
}
