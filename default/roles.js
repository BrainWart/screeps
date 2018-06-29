function roles(room) {
	this.room = room;
}

roles.actions = {
	builder: "build",
	spawner: "spawn",
	upgrader: "upgrade"
}

roles.prototype.requested = function() {
	let level = this.room.controller.level;
	let request = { spawner: 0, builder: 0, upgrader: 0 };

	switch (level) {
		case 4: // 1300 energy
			request.builder  = 4;
			request.spawner  = 1;
			request.upgrader = 4;
			break;
		case 3: // 800 energy
			request.builder  = 8;
			request.spawner  = 2;
			request.upgrader = 2;
			break;
		case 2: // 550 energy
			request.builder  = 5;
			request.spawner  = 1;
			request.upgrader = 1;
			break;
		case 1: // 300 energy
			request.builder  = 0;
			request.spawner  = 0;
			request.upgrader = 2;
			break;
	}

	return request;
}

roles.prototype.needed = function() {
	let needed = this.requested();
	_.forEach(
		_.filter(Game.creeps, (creep) => creep.room.name == this.room.name),
		function(creep) {
			if (typeof(needed[creep.memory.role]) == "number") {
				needed[creep.memory.role] -= 1;
			}
		}
	);
	return needed;
}

roles.prototype.next = function() {
	let needed = this.needed();

	let largest = {role: false, count: Number.MIN_VALUE};

	_.forEach(needed, function(count, role) {
		if (count > largest.count) {
			largest.role = role;
			largest.count = count;
		}
	});

	return largest.role;
}

module.exports = roles;