module.exports = {
	"makeBody": function(energyAvailable) {
		let cost = 150;
		let body = [MOVE, WORK];
		
		if (cost >= energyAvailable)
			return {"cost": cost, "body": body};

		let parts = [WORK];
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
		if (target) {
			if (target.pos.isNearTo(creep)) {
				creep.harvest(target)
			} else {
				creep.moveTo(target);
			}
		} else {
			target = creep.room.find(FIND_SOURCES_ACTIVE)[0];
			if (target)
				creep.memory.targetId = target.id;
			console.log("harvester {0}: now targets {1}".format(creep.name, target.id));
		}
	}
}
