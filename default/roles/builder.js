module.exports = {
	"makeBody": function(energyAvailable) {
		let cost = 200;
		let body = [MOVE, WORK, CARRY];
		
		if (cost >= energyAvailable)
			return {"cost": cost, "body": body};
		
		let parts = [WORK, CARRY, MOVE];
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
				if (creep.pos.isNearTo(target.pos))
					if (target instanceof ConstructionSite)
						creep.build(target);
					else if (target instanceof Structure)
						creep.repair(target);
					else
						console.log("somehing funny going on!");
				else
					creep.moveTo(target);

				if (target.progress == target.progressTotal)
					delete creep.memory.targetId;
			} else {
				let sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
				
				let targetId = null;
				if (sites.length > 0) {
					targetId = sites[0].id;
				} else {
					let toRepair = creep.room.find(FIND_STRUCTURES);
					if (toRepair.length > 0) {
						for (let i = 0; i < toRepair.length; i++) {
							let repair = toRepair[i];

							if (repair instanceof StructureWall || repair instanceof StructureRampart) {
								if (repair.hits < 1000) {
									targetId = repair.id;
									break;
								} else { continue; }
							} else if (repair.hits < repair.hitsMax) {
								targetId = repair.id;
								break;
							}
						}
					} else {
						console.log("no constuction to be done!");
						creep.memory.working = false;
					}
				}

				creep.memory.targetId = targetId;
			}

			if (creep.carry[RESOURCE_ENERGY] == 0) {
				creep.memory.working = false;
				delete creep.memory.targetId;
			}
		} else {
			let target = Game.getObjectById(creep.memory.targetId);
			if (target) {
				if (target.pos.isNearTo(creep)) {
					if (target instanceof Resource) {
						creep.pickup(target)
					} else if (target instanceof Source) {
						creep.harvest(target)
					} else console.log("instanceof what?");
				} else {
					if (target instanceof Resource) {
						if (target.amount < 30)
							delete creep.memory.targetId;
					}
					creep.moveTo(target);
				}
			} else {
				let droppedEnergies = creep.room.find(FIND_DROPPED_RESOURCES);
				let targetId = null;
				for (let i = 0; i < droppedEnergies.length; i++) {
					let drop = droppedEnergies[i];

					if (drop.amount > creep.carryCapacity) {
						targetId = drop.id;
					}
				}
				if (!targetId) {
					let source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
					targetId = source.id;
				}
				
				creep.memory.targetId = targetId;
				console.log("builder {0}: now targets {1}".format(creep.name, creep.memory.targetId));
			}

			if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
				creep.memory.working = true;
				delete creep.memory.targetId;
			}
		}
	}
}
