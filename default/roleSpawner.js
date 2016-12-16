var roleHarvester = require("roleHarvester");

module.exports = {
	"body": [MOVE, WORK, WORK, CARRY],
	"minimum": 3,
	"run": function(creep) {
		if (creep.carry.energy < 1) {
			creep.memory.working = false;
		}

		if (creep.memory.working) {
			var dest = Game.getObjectById(creep.memory.dest);

			if (dest == undefined || !(dest instanceof StructureExtension || dest instanceof StructureSpawn)) {
				dest = creep.pos.findClosestByPath(FIND_STRUCTURES, {
					filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION
								|| structure.structureType == STRUCTURE_SPAWN
								&& structure.energy < structure.energyCapacity
					}
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
				console.log(creep.name + ": no spawn/extension found.");
			}
		} else {
			roleHarvester.run(creep);
			if (creep.carry.energy == creep.carryCapacity) {
				creep.memory.working = true;
			}
		}
	}
};
