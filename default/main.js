let actions = require("actions");
let roles = require("roles");

global.getRoomCreepNeeds = function(roomName) {
	if (roomName === undefined) roomName = _.find(Game.rooms).name;
	let room = Game.rooms[roomName];
	let str = room.name + ": ";

	_.forEach(new roles(room).needed(), function(a, b) {
		str += "{" + a + "," + b + "} ";
	});

	return str;
}

module.exports.loop = function() {
	_.forEach(Memory.creeps, function(mem, creepName) {
		if (!Game.creeps[creepName])
			delete Memory.creeps[creepName];
	});

	_.forEach(Game.creeps, function(creep) {
		let action = actions[_.first(creep.memory.actions)];

		if (action) {
			action.act(creep);
		} else {
			let newRole = new roles(creep.room).next();
			creep.memory = actions[roles.actions[newRole]]();
		}
	});

	_.forEach(Game.spawns, function(spawn) {
		let currentRoomRoles = new roles(spawn.room);
		let newRole = currentRoomRoles.next();
		if (newRole) {
			if (spawn.room.energyAvailable >= 300) {
				spawn.spawnCreep([CARRY, CARRY, WORK, MOVE, MOVE],
					newRole + Game.time % 10000,
					actions[roles.actions[newRole]]());
			}
	}
	});
}
