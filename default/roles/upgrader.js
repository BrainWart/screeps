module.exports = {
	"makeBody": function(energyAvailable) {
		let cost = 200;
		let body = [MOVE, WORK, CARRY];
		
		if (cost >= energyAvailable)
			return {"cost": cost, "body": body};
		
		let parts = [CARRY, MOVE, CARRY, WORK];
		for (let i = 0; cost <= energyAvailable; i++) {
			let part = parts[i % parts.length];
			cost += BODYPART_COST[part];
			body.push(part);
		}
		cost -= BODYPART_COST[body.pop()];

		return {"cost": cost, "body": body};
	},
	"work": function(creep) {
		if (creep.memory.working) {
			if (creep.pos.inRangeTo(creep.room.controller, 3))
				creep.upgradeController(creep.room.controller);
			else
				creep.moveTo(creep.room.controller);

			if (creep.carry[RESOURCE_ENERGY] == 0) {
				creep.memory.working = false;

				if (Game.getObjectById(creep.memory.targetId) instanceof Source)
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
					if (source)
						targetId = source.id;
				}
				
				creep.memory.targetId = targetId;
				if (targetId)
					console.log("upgrader {0}: now targets {1}".format(creep.name, targetId));
			}

			if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) creep.memory.working = true;
		}
	}
}
