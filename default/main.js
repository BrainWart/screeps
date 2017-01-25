require("prototype.Creep")();
require("prototype.Room")();

var roles = require("data").roles;

module.exports.loop = function() {
    let roleCounts = {}
	_.forEach(roles, (obj, name) => (roleCounts[name] = 0));

    { // CREEP LOGIC
		for (var cn in Memory.creeps) {
			if (Game.creeps[cn]) {
				let creep = Game.creeps[cn];
				let role = Memory.creeps[cn].role;
				Game.creeps[cn].work();
				if (role)
					roleCounts[role]++;
			} else if (Memory.creeps[cn].birth) {
				let room = Game.rooms[Memory.creeps[cn].birth];
				let queue = room.spawnQueue;
				queue.push(Memory.creeps[cn].role);
				room.spawnQueue = queue;
				delete Memory.creeps[cn];
			} else {
				delete Memory.creeps[cn];
			}
		}
	}

	{ // SPAWN NEW CREEPS
		for (let r in Game.rooms) {
			let room = Game.rooms[r];
			let queue = room.spawnQueue;
			
			if (queue.length > 0) {
				let spawns = room.getSpawns();

				for (let s in spawns) {
					let spawn = spawns[s];

					if (spawn.energy == spawn.energyCapacity) {
						let role = queue.shift();
						if (spawn.canCreateCreep(roles[role].body()) == OK) {
							spawn.createCreep(roles[role].body(), undefined, {"role": role, "birth": r});
						} else {
							queue.push(role);
							console.log("FAILURE: failed to spawn creep [" + role + "]");
						}
					}
				}

				room.spawnQueue = queue;
			}
		}
	} //*/
}
