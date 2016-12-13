var tasks = {}
tasks.setup = {}
tasks.COMPLETED = 10001

tasks.harvest = function(creep, toharvest) {
    if (creep.carry.energy < creep.carryCapacity && toharvest instanceof Source) {
        return creep.harvest(toharvest);
    }
    
    return tasks.COMPLETED;
}
tasks.setup.harvest = function (creep) {
    creep.memory.task = "harvest";
    var toharvest = creep.pos.findClosestByPath(FIND_SOURCES);
    if (toharvest)
        creep.memory.taskdest = toharvest.id;
    else
        creep.memory.taskdest = null;
}

tasks.build = function(creep, tobuild) {
    if (creep.carry.energy < 1)
        return tasks.COMPLETED;

    if (tobuild) 
        return creep.build(tobuild);
}
tasks.setup.build = function(creep) {
	creep.memory.task = "build";
	var tobuild = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
	if (tobuild)
		creep.memory.taskdest = tobuild.id;
	else
		creep.memory.taskdest = null;
}

tasks.upgrade = function(creep, controller) {
    if (creep.carry.energy < 1)
        return tasks.COMPLETED;

    if (controller) 
        return creep.upgradeController(controller);
}
tasks.setup.upgrade = function(creep) {
    creep.memory.task = "upgrade";
    if (creep.room.controller.my)
        creep.memory.taskdest = creep.room.controller.id;
    else
        creep.memory.taskdest = null;
}
tasks.transfer = function(creep, to) {
    if (creep.carry.energy < 1)
        return tasks.COMPLETED;
    return creep.transfer(to, RESOURCE_ENERGY);
}
tasks.setup.transfer = function(creep) {
    creep.memory.task = "transfer";
    
    var transferstruct = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter : (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity; }
    });
    
    if (transferstruct)
        creep.memory.taskdest = transferstruct.id;
    else
        creep.memory.taskdest = null;
}
tasks.new = function(creep) {
    if (creep.getActiveBodyparts(WORK) > 0) {
        if (creep.carry.energy < 1) {
            tasks.setup.harvest(creep);
            return;
        }
        
        var nextOrder = ([
    		tasks.setup.upgrade,
    		tasks.setup.upgrade,
    		tasks.setup.build,
    		tasks.setup.transfer,
    		tasks.setup.transfer
        ])[Math.floor(Math.random() * 5)];
    	if (nextOrder && creep.memory.taskdest) {
    		nextOrder(creep);
    		// console.log(creep.memory.task);
    	} else
    		creep.say("NO ORDERS");
    }
}
module.exports = tasks;
