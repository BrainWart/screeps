let Upgrader = {}

Upgrader.body = function(energy) { return [MOVE, WORK, WORK, CARRY]; };

function firstRun(creep) {
	creep.memory.working = false;
	creep.memory.controller = creep.room.controller.id
	creep.memory.energy = undefined;
}

Upgrader.run = function(creep) {
	if (creep.memory.working == undefined) firstRun(creep);

	if (creep.carry[RESOURCE_ENERGY] == 0) {
		creep.memory.working == false;
	} else if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
		creep.memory.working == true;
	}

	if (creep.memory.working) {
		let controller = Game.getObjectById(creep.memory.controller);
		if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
			creep.moveTo(controller);
		}
	} else {
		let energyObj = Game.getObjectById(creep.memory.energy);

		if ((energyObj instanceOf Resource && energyObj.amount == 0)
				|| ((energyObj instanceOf StructureContainer || energyObj instanceOf StructureStorage)
						&& energyObj.store[RESOURCE_ENERGY] == 0)) {
			energyObj = undefined;
		}
		
		if (energyObj == undefined) {
			energyObj = creep.room.getEnergy();
			creep.memory.energy = energyObj.id;
		}

		if (energyObj instanceOf Resource) {
			if (creep.pickup(energyObj) == ERR_NOT_IN_RANGE) {
				creep.moveTo(energyObj);
			}
		} else if (energyObj instanceOf StructureStorage || energyObj instanceOf StructureContainer) {
			if (creep.withdraw(energyObj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(energyObj);
			}
		}
	}
}

module.exports = Upgrader;
