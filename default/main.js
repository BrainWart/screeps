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
			creepCounts[r] = 0;
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
			
			for (var role in creepCounts) {
				if (creepCounts[role] < roles[role].minimum && (spawn.canCreateCreep(roles[role].body) == OK)) {
					spawn.createCreep(roles[role].body, undefined, {"role": role, "working": false});
				}
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
