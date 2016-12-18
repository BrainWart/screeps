var roleHarvester = require("roleHarvester");
var roleUpgrader = require("roleUpgrader");

module.exports = {
	"body": function(energy) { return [MOVE, MOVE, WORK, CARRY, CARRY]; },
	"minimum": 2,
	"run": function(creep) {
		if (creep.carry.energy < 1) {
			creep.memory.working = false;
		}

		if (creep.memory.working) {
			var dest = Game.getObjectById(creep.memory.dest);

			if (dest == undefined || !(dest instanceof ConstructionSite)) {
				dest = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
				if (dest) {
					creep.memory.dest = dest.id;
				}
			}

			if (dest) {
				if (creep.build(dest) == ERR_NOT_IN_RANGE) {
					creep.moveTo(dest);
				}
			} else {
				console.log(creep.name + ": no construction sites found.");
				roleUpgrader.sun(creep);
			}
		} else {
			roleHarvester.run(creep);
			if (creep.carry.energy == creep.carryCapacity) {
				creep.memory.working = true;
			}
		}
	}
};
