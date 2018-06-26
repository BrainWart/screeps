let jobState = 0;

function job(state) {
    if (typeof(state) == "undefined" || state == null) state = 0;
    jobState = state;
    this.name = "job";
}

job.getJob = function(type, state) {
    let nJob = require(type)(state);
    if (nJob instanceof job)
        return nJob;
    throw new Exception("'" + type + "' is not a job!");
}

job.prototype = {};
job.prototype.getstate = function() {
    return jobState;
}
job.prototype.work = function() {
    jobState++;
}

module.exports = job;
