
var Harvester = {}

Harvester.body = function(energy) {
	let body = [MOVE];
	for (let a = energy - 50; a > 100 || body.length > 6; a -= 100)
		body.push(WORK);
	return body;
}
Harvester.work =  function(creep) {
	if (creep.spawning) return;

	let source = Game.getObjectById(creep.memory.source);

	if (source == undefined) {

	}
}
module.exports = Harvester;
