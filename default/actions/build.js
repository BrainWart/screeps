function action() {
    return {
        role: action.role,
        actions: [action.type]
    }
}

function getSink(creep) {
	for (let site in creep.room.find(FIND_MY_CONSTRUCTION_SITES)) {
		return site
	}

	return null;
}

function act(creep) {
	let sink = Game.getObjectById(creep.memory.sink);
	if (sink) {
		if (creep.pos.isNearTo(sink)) {
			creep.build(sink);
		} else {
			creep.moveTo(sink);
		}
	} else {
		sink = getSink(creep);
		if (sink == null) {
			creep.memory.sink = null;
			creep.memory.actions.unshift("upgrade");
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

action.type = "build";
action.role = "builder";
action.act = act;

module.exports = action;
