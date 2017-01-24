let roles = require("main").roles;

module.exports = function() {
	Creep.prototype.work = function() {
		if (this.ticksToLive < 100) {
			Memory.creeps[this.name] = null;
			this.say("I'm dying!!!!.... ehhh", false);
			this.suicide();
			return;
		}

		if (_.isNull(this.memory) || _.isNull(this.memory.role)) {
			Memory.creeps[this.name] = null;
			this.say("I'm broken!!  *dead*", false);
			this.suicide();
			return;
		}

		roles[this.memory.role].run(this);
	}
};
