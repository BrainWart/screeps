module.exports.loop = function() {
    if (_.size(Game.creeps) < 3)
        Game.spawns.Spawn1.spawnCreep([MOVE,MOVE,WORK,CARRY],"creep" + Game.time);
	for (let x in Game.creeps) {
	    x = Game.creeps[x];
	    if (_.isUndefined(x.memory)) {
	        x.memory = {role:"upgrader"};
	    }
	    switch (x.memory.role) {
	        case "upgrader":
	            if (x.memory.working) {
	                x.moveTo(x.room.controller);
	                x.upgradeController(x.room.controller);
	                if (x.carry[RESOURCE_ENERGY] == 0) x.memory.working = false;
	            } else {
	                let source = x.room.find(FIND_SOURCES_ACTIVE)[0];
	                x.moveTo(source);
	                x.harvest(source);
	                if (x.carry[RESOURCE_ENERGY] == x.carryCapacity) x.memory.working = true;
	            }
	            break;
	        default:
	            x.memory.role = "upgrader";
	    }
	}
}
