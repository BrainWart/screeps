String.prototype.format = String.prototype.format || function() {
	let str = this.toString();
	if (arguments.length) {
		let t = typeof arguments[0];
		let key;
		let args = ("string" === t || "number" === t) ?
		    Array.prototype.slice.call(arguments)
			: arguments[0];
			
		for (key in args) {
			str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
		}
	}
	return str;
};
// let console = {log: function() {}};
let roles = {
	"harvester": require("roles_harvester"),
	"upgrader": require("roles_upgrader"),
	"builder": require("roles_builder"),
	"spawner": require("roles_spawner"),
	"attacker": require("roles_attacker")
};

let createCreep = function(role, maxEnergy) {
	maxEnergy = maxEnergy || Game.spawns.Spawn1.room.energyAvailable;
	let creepInfo = roles[role].makeBody(maxEnergy);
	if (creepInfo.cost > maxEnergy) {
		console.log("Failed creating {0}. needs {1}, has {2}".format(role, creepInfo.cost, maxEnergy));
		console.log(creepInfo.body);
	} else {

		Game.spawns.Spawn1.spawnCreep(creepInfo.body,role + Game.time, {memory: {'role': role}});
	}
}

module.exports.loop = function() {
	for (let x in Memory.creeps) {
		if (!Game.creeps[x])
			delete Memory.creeps[x];
	}

	let counts = {harvester: 0, upgrader: 0, builder: 0, spawner: 0, attacker: 0};
	for (let x in Game.creeps) {
		x = Game.creeps[x];
		if (_.isUndefined(x.memory)) {
			x.memory = {role:"upgrader"};
		}

		if (roles[x.memory.role].work)
			roles[x.memory.role].work(x);
		else
			console.log("No work for '{0}'".format(x.memory.role));

		counts[x.memory.role]++;
	}

	if (counts["harvester"] < 2)
		createCreep("harvester");
	else if (counts["spawner"] < 2)
		createCreep("spawner");
	else if (counts["upgrader"] < 5)
		createCreep("upgrader");
	else if (counts["builder"] < 2)
		createCreep("builder");
	else if (counts["attacker"] < 0)
		createCreep("attacker");
}
