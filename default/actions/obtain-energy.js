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
    		if (source instanceof Resource) {
    			creep.pickup(source);
    		} else if (source instanceof Tombstone) {
    			creep.widthdraw(source, RESOURCE_ENERGY);
    		} else if (source.structureType == STRUCTURE_CONTAINER) {
    			creep.widthdraw(source, RESOURCE_ENERGY);
    		} else if (source.structureType == STRUCTURE_STORAGE) {
    			creep.widthdraw(source, RESOURCE_ENERGY);
    		} else {
    			creep.say("derp");
    			creep.memory.source = null;
    		}
    	} else {
    		creep.moveTo(source);
    	}
    } else {
    	source = _.find(creep.room.find(FIND_DROPPED_RESOURCES,
    		(drop) => drop.resourceType == RESOURCE_ENERGY));
    	if (source) {
    		creep.memory.source = source.id;
    		return;
    	}

		source = _.find(creep.room.find(FIND_TOMBSTONES,
			(stone) => stone.store[RESOURCE_ENERGY] > 70));
		if (source) {
    		creep.memory.source = source.id;
    		return;
    	}

    	source = _.find(creep.room.find(FIND_MY_STRUCTURES, 
    		{ filter: (struct) => (struct.structureType == STRUCTURE_CONTAINER
    			|| struct.structureType == STRUCTURE_STORAGE)
    		&& struct.store[RESOURCE_ENERGY] > 100}));
    	if (source) {
    		creep.memory.source = source.id;
    		return;
    	}
    }

    if (source === undefined || source == null) {
    	creep.memory.actions.unshift("harvest-energy");
    	return;
    }

    if (creep.memory.actions.length > 1) {
		creep.memory.actions.shift();
	}
}

action.type = "obtain-energy";
action.role = "";
action.act = act;

module.exports = action;
