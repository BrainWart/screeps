require("prototype.Creep")();

var roles = require("data").roles;

module.exports.loop = function() {
	{ // SPAWN NEW CREEPS
	}
    
    { // CREEP LOGIC
		for (var cn in Game.creeps) {
			Game.creeps[cn].run();
		}
	}
}
