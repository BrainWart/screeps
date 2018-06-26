let jobState = 0;

function job(state) {
    if (typeof(state) == "undefined" || state == null) state = 0;
    jobState = state;
    this.name = "job";
}

job.prototype = new Object();
job.prototype.getstate = function() {
    return jobState;
}
job.prototype.work = function() {
    jobState++;
}

module.exports = job;
