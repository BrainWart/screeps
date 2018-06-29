function action() {
    return {
        role: action.role,
        actions: [action.type]
    }
}

function act(creep) {
	let source = Game.getObjectById(creep.memory.source);

	if (source) {
		if (creep.pos.isNearTo(source)) {
			creep.harvest(source);
		} else {
			if (creep.moveTo(source) == ERR_NO_PATH) {
				creep.memory.source = null;
			}
		}
	} else {
		source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
		if (source) {
			creep.memory.source = source.id;
		}
	}

	if (_.sum(creep.carry) == creep.carryCapacity) {
		if (creep.memory.actions.length > 1) {
			creep.memory.actions.shift();
		} else {
			let container = Game.getObjectById(creep.memory.container);
			if (container) {
				if (creep.pos == container.pos) {
					creep.drop(RESOURCE_ENERGY);
				} else {
					creep.moveTo(container);
				}
			} else {
				container = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
					(structure) => (structure instanceof StructureContainer));
				if (creep.pos.getRangeTo(container) > 4) {
					creep.pos.createConstructionSite(STRUCTURE_CONTAINER);
					creep.drop(RESOURCE_ENERGY);
				} else {
					creep.memory.container = container.id;
				}
			}
		}
	}
}

action.type = "harvest-energy";
action.role = "harvester";
action.act = act;

module.exports = action;
