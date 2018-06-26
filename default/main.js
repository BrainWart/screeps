let Job = require("job")
let Upgrade = require("jobs_upgrade")

module.exports.loop = function() {
    let j = new Upgrade();
    j.work();
}
