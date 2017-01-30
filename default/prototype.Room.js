let data = require("data");

module.exports = function() {
	Room.prototype.getSpawns = function() {
		return this.find(FIND_MY_SPAWNS);
	};
	Object.defineProperty(Room.prototype, "spawnQueue", {
		get: function() { return this.memory.spawnQueue ? this.memory.spawnQueue : data.spawnQueue; },
		set: function(queue) { this.memory.spawnQueue = queue; }
	});
	Room.prototype.getOpenSource = function() {
		return _.first(this.find(FIND_SOURCES, {filter: function(source) {
				return Game.flags[source.id] == undefined;
			}}));
	};
	Room.prototype.getEnergy = function() {
		let workingSources = this.find(FIND_SOURCES, {filter: (source) => (Game.flags[source.id])});
		for (let source in workingSources) {
			let atFlag = Game.flags[workingSources[source].id].pos.look();
			for (let o in atFlag) {
				let object = atFlag[o];
				switch (object.type) {
					case "resource":
						if (object.resource.resourceType == RESOURCE_ENERGY)
							return object.resource;
						break;
					case "structure":
						let structureType = object.structure.structureType;
						if ((structureType == STRUCTURE_CONTAINER || structureType == STRUCTURE_STORAGE)
									&& object.structure.store[RESOURCE_ENERGY]) {
							return object.structure;
						}
						break;
				}
			}
		}
	};
};
