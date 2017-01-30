let roles = require("data").roles;

module.exports = function() {
	Creep.prototype.work = function() {
		// Don't waste cycles on a creep doing nothing
		if (this.spawning) {
			// return;
		}

		// Kill old creeps and remove old memory
		if (this.ticksToLive < 100) {
			this.suicide();
			return;
		}

		// Kill creeps with broken memory
		if (_.isNull(this.memory) || _.isEmpty(this.memory) || _.isNull(this.memory.role)) {
			this.suicide();
			return;
		}

		require(roles[this.memory.role]).run(this);
	};
};
