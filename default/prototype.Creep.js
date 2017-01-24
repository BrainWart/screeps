let roles = require("data").roles;

module.exports = function() {
	Creep.prototype.work = function() {
		// Kill old creeps and remove old memory
		if (this.ticksToLive < 100) {
			Memory.creeps[this.name] = null;
			this.say("I'm dying!!!!.... ehhh", false);
			this.suicide();
			return;
		}

		// Kill creeps with broken memory
		if (_.isNull(this.memory) || _.isEmpty(this.memory) || _.isNull(this.memory.role)) {
			delete Memory.creeps[this.name];
			this.say("I'm broken!!  *dead*", false);
			this.suicide();
			return;
		}

		roles[this.memory.role].run(this);
	}
};
