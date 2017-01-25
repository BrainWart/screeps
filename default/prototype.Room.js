let data = require("data");

module.exports = function() {
	Room.prototype.getSpawns = function() {
		return this.find(FIND_MY_SPAWNS);
	};
	Object.defineProperty(Room.prototype, "spawnQueue", {
		get: function() { return this.memory.spawnQueue ? this.memory.spawnQueue : data.spawnQueue; },
		set: function(queue) { this.memory.spawnQueue = queue; }
	});
	Room.prototype.getEnergyPos = function() {

	};
};