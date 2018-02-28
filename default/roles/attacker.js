module.exports = {
	"makeBody": function(energyAvailable) {
		let cost = 130;
		let body = [MOVE, ATTACK];
		
		if (cost >= energyAvailable)
			return {"cost": cost, "body": body};

		let parts = [MOVE, ATTACK];
		for (let i = 0; cost <= energyAvailable && cost < 400; i++) {
			let part = parts[i % parts.length];
			cost += BODYPART_COST[part];
			body.push(part);
		}
		cost -= BODYPART_COST[body.pop()];

		return {"cost": cost, "body": body};
	},
	"work": function(creep) { 
		let target = Game.flags["attack"];
		if (target) {
			if (target.pos.isNearTo(creep)) {
				let objects = creep.room.lookAt(target);
				let attacked = false;
				for (let i = 0; i < objects.length; i++) {
					let obj = objects[i];
					if (obj.type == "structure") {
						creep.attack(obj.structure);
						attacked = true;
					}
				}
				if (!attacked) console.log("need new attack flag!");
			} else {
				creep.moveTo(target);
			}
		} else {
			console.log("no attack flag");
		}
	}
}
