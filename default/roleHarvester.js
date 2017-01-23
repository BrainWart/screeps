module.exports = {
	"body" : function(energy) {
		let body = [MOVE];
		for (let a = energy - 50; a > 100 || body.length > 6; a -= 100)
			body.push(WORK);
		return body;
	},
	"minimum": 0,
	"gravity": 1,
	"setup": function(creepName) }

	},
	"run": function(creep) {
		var dest = Game.getObjectById(creep.memory.dest);

		if (dest == undefined || !(dest instanceof Source)) {
			dest = creep.pos.findClosestByPath(FIND_SOURCES, {
				filter: (source) => { return source.energy > 0 }
			});
			if (dest) {
				creep.memory.dest = dest.id;
			}
		}

		if (dest) {
			if (creep.harvest(dest) == ERR_NOT_IN_RANGE) {
				creep.moveTo(dest);
			}
		} else {
			console.log(creep.name + ": no sources found.");
		}
	}
};
