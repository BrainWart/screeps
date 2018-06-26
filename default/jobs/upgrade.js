let Job = require("job");

function upgrade(state) {
    Job.call(this, state);
    this.name = "upgrade";
}

upgrade.prototype = Object.create(Job.prototype);

upgrade.prototype.work = function(a) {
    console.log(this.getstate());
    this.__proto__.__proto__.work();
}


module.exports = upgrade;
