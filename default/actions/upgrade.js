function action() {
    return {
        role: action.role,
        actions: [action.type]
    }
}

function act(creep) {
	if (creep.carry[RESOURCE_ENERGY] > 0) {
		if (creep.pos.inRangeTo(creep.room.controller, 3)) {
			creep.upgradeController(creep.room.controller);
		} else {
			creep.moveTo(creep.room.controller);
		}
	} else {
		if (creep.memory.actions.length > 1) {
			creep.memory.actions.shift();
		}
		creep.memory.actions.unshift("obtain-energy");
	}
}

action.type = "upgrade";
action.role = "upgrader";
action.act = act;

module.exports = action;
