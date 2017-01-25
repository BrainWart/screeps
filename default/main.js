require("prototype.Creep")();

var roles = require("data").roles;

module.exports.loop = function() {
    let roleCounts = {}
	_.forEach(roles, (obj, name) => (roleCounts[name] = 0));

    { // CREEP LOGIC
		for (var cn in Memory.creeps) {
			if (Game.creeps[cn]) {
				let creep = Game.creeps[cn];
				let role = Memory.creeps[cn].role;
				Game.creeps[cn].work();
				if (role)
					roleCounts[role]++;
			} else {
				delete Memory.creeps[cn];
			}
		}
	}

	/* { // SPAWN NEW CREEPS
		for (var role in roles) {
			if (roles[role].shouldSpawn(roleCount)) {
				
			}
		}
	} //*/
}
