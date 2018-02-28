module.exports = {
	"makeBody": function(energyAvailable) {
		let cost = 100;
		let body = [MOVE, CARRY];
		
		if (cost >= energyAvailable)
			return {"cost": cost, "body": body};
		
		let parts = [CARRY, MOVE];
		for (let i = 0; cost <= energyAvailable; i++) {
			let part = parts[i % parts.length];
			cost += BODYPART_COST[part];
			body.push(part);
		}
		cost -= BODYPART_COST[body.pop()];

		return {"cost": cost, "body": body};
	},
	"work": function(creep) {
		let target = Game.getObjectById(creep.memory.targetId);
		if (creep.memory.working) {
			if (target) {
				if (!(target instanceof StructureSpawn || target instanceof StructureExtension)) {
					delete creep.memory.targetId;
					return;
				}
				if (creep.pos.isNearTo(target.pos))
					creep.transfer(target, RESOURCE_ENERGY);
				else
					creep.moveTo(target);

				if (target.energy == target.energyCapacity)
					delete creep.memory.targetId;
			} else {
				let spawns = creep.room.find(FIND_MY_STRUCTURES,
						{filter: (s) => s.structureType == STRUCTURE_SPAWN
							|| s.structureType == STRUCTURE_EXTENSION});
				
				let targetId = null;
				for (let i = 0; i < spawns.length; i++) {
					let spawn = spawns[i];
					if (spawn.energy < spawn.energyCapacity) {
						targetId = spawn.id;
					}
				}

				if (!targetId) {
					console.log("All spawners full?");
					creep.memory.working = false;
					delete creep.memory.targetId;
				}
				creep.memory.targetId = targetId;
			}

			if (creep.carry[RESOURCE_ENERGY] == 0) {
				creep.memory.working = false;
				delete creep.memory.targetId;
			}
		} else {
			if (target) {
				if (target.pos.isNearTo(creep)) {
					if (target instanceof Resource) {
						creep.pickup(target)
					} else if (target instanceof Source) {
						creep.harvest(target)
					} else console.log("instanceof what?");
				} else {
					if (target instanceof Resource && target.amount < 30) {
						delete creep.memory.targetId;
					}
					creep.moveTo(target);
				}
			} else {
				let droppedEnergies = creep.room.find(FIND_DROPPED_RESOURCES,
						{filter: (x) => x.resourceType == RESOURCE_ENERGY && x.amount > 20});
				let targetId = null;
				for (let i = 0; i < droppedEnergies.length; i++) {
					let drop = droppedEnergies[i];

					targetId = drop.id;
				}

				creep.memory.targetId = targetId;
				console.log("spawner {0}: now targets {1}".format(creep.name, targetId));

				if (!targetId) {
					creep.memory.working = true;
					delete creep.memory.targetId;
				}
			}

			if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
				creep.memory.working = true;
				delete creep.memory.targetId;
			}
		}
	}
}
