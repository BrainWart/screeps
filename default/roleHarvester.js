module.exports = {
	"body" : [MOVE, WORK, WORK, CARRY],
	"minimum": 0,
	"run": function(creep) {
		var dest = Game.getObjectById(creep.memory.dest);

		if (dest == undefined || !(dest instanceof Source)) {
			dest = creep.pos.findClosestByPath(FIND_SOURCES, {
				filter: (source) => { return source.energy > 0 }
			});
			creep.memory.dest = dest.id;
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
