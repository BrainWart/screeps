let Upgrader = {}

Upgrader.body = function(energy) { return [MOVE, WORK, WORK, CARRY]; };

function firstRun(creep) {
	creep.memory.working = false;
	creep.memory.spawn = undefined;
	creep.memory.energy = undefined;
}

Upgrader.run = function(creep) {
	if (creep.memory.working == undefined) firstRun(creep);

	if (creep.carry[RESOURCE_ENERGY] == 0) {
		creep.memory.working = false;
	} else if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
		creep.memory.working = true;
	}

	if (creep.memory.working) {
		let spawn = Game.getObjectById(creep.memory.spawn);
		if (spawn == undefined) {
			spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => {return (structure instanceof StructureExtension
					|| structure instanceof StructureSpawn)
					&& structure.energy < structure.energyCapacity}});
			if (spawn == undefined) {
				creep.say("no work.");
				return;
			}
			creep.memory.spawn = spawn.id;
		}
		if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(spawn);
		}
	} else {
		let energyObj = Game.getObjectById(creep.memory.energy);

		if ((energyObj instanceof Resource && energyObj.amount == 0)
				|| ((energyObj instanceof StructureContainer || energyObj instanceof StructureStorage)
						&& energyObj.store[RESOURCE_ENERGY] == 0)) {
			energyObj = undefined;
		}
		
		if (energyObj == undefined) {
			energyObj = creep.room.getEnergy();
			creep.memory.energy = energyObj.id;
		}

		if (energyObj instanceof Resource) {
			if (creep.pickup(energyObj) == ERR_NOT_IN_RANGE) {
				creep.moveTo(energyObj);
			}
		} else if (energyObj instanceof StructureStorage || energyObj instanceof StructureContainer) {
			if (creep.withdraw(energyObj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(energyObj);
			}
		}
	}
}

module.exports = Upgrader;
