var roleHarvester = require("roleHarvester");

module.exports = {
	"body": [MOVE, WORK, WORK, CARRY],
	"minimum": 7,
	"run": function(creep) {
		if (creep.carry.energy < 1) {
			creep.memory.working = false;
		}

		if (creep.memory.working) {
			var dest = Game.getObjectById(creep.memory.dest);

			if (dest == undefined || !(dest instanceof StructureController)) {
				dest = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
					filter: (structure) => { return structure.structureType == STRUCTURE_CONTROLLER }
				});
				if (dest) {
					creep.memory.dest = dest.id;
				}
			}

			if (dest) {
				if (creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(dest);
				}
			} else {
				console.log(creep.name + ": no controller found.");
			}
		} else {
			roleHarvester.run(creep);
		}
	}
};
