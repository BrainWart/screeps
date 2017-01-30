var Harvester = {}

Harvester.body = function(energy) {
	let body = [MOVE];
	for (let a = energy - 50; a > 100 || body.length > 6; a -= 100)
		body.push(WORK);
	return body;
}

function firstSpawn(creep) {
	let source = creep.room.getOpenSource();
	let path = creep.pos.findPathTo(source);
	creep.room.createFlag(path[path.length-2].x,path[path.length-2].y, source.id, COLOR_YELLOW, COLOR_YELLOW);
	creep.memory.sourceId = source.id;
	creep.memory.path = Room.serializePath(path);
}
Harvester.run = function(creep) {
	if (creep.memory.sourceId == undefined) {
		firstSpawn(creep);
	}

	let id = creep.memory.sourceId;
	let source = Game.getObjectById(id);
	let flag = Game.flags[id];

	if (creep.pos.isEqualTo(flag.pos)) {
		creep.harvest(source);
	} else if (creep.fatigue == 0) {
		let path = Room.deserializePath(creep.memory.path);

		switch(creep.moveByPath(path)) {
			case ERR_NO_BODYPART:
				creep.say("no MOVE part");
				break;
			case ERR_TIRED:
				break;
			case ERR_INVALID_ARGS:
				creep.say("illegal path");
				break;
			case ERR_NOT_FOUND:
				creep.say("can't use path");
				break;
			case ERR_BUSY:
				creep.say("busy");
				break;
		}
	}
}
module.exports = Harvester;
