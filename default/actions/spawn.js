function action() {
	return {
		role: action.role,
		actions: [action.type]
	}
}

function getSink(creep) {
	for (let spawn in Game.spawns) {
		spawn = Game.spawns[spawn];
		if (spawn.room.name == creep.room.name) {
			if (spawn.energy < spawn.energyCapacity) {
				return spawn;
			}
		}
	}

	for (let extension in creep.room.find(FIND_MY_STRUCTURES, 
		{ filter: (struct) => struct.structureType == STRUCTURE_EXTENSION})) {
		if (extension.energy < extension.energyCapacity) {
			return extension;
		}
	}

	return null;
}

function act(creep) {
	let sink = Game.getObjectById(creep.memory.sink);
	if (sink) {
		if (creep.pos.isNearTo(sink)) {
			creep.transfer(sink, RESOURCE_ENERGY);
		} else {
			creep.moveTo(sink);
		}
	} else {
		sink = getSink(creep);
		if (sink == null) {
			creep.memory.sink = null;
			creep.memory.actions.unshift("build");
		} else {
			creep.memory.sink = sink.id;
		}
	}

	if (creep.carry[RESOURCE_ENERGY] == 0) {
		if (creep.memory.actions.length > 1) {
			creep.memory.actions.shift();
		}

		creep.memory.actions.unshift("obtain-energy");
	}
}

action.type = "spawn";
action.role = "spawner";
action.act = act;

module.exports = action;
