var tasks = require("tasks");

module.exports.loop = function() {
	for (var r in Game.rooms) {
		var room = Game.rooms[r];
		if (room.controller.level > room.memory.lastLevel ) {
			Game.notify(("room [{0}] has leveled up to {1}").format(room.id, room.controller.level));
			room.memory.lastLevel = room.controller.level;
		}
	}
	
    for (var n in Game.spawns) {
        var spawn = Game.spawns[n];
        if (spawn.canCreateCreep([MOVE, MOVE, WORK, CARRY, CARRY]) == OK) {
            var creep = spawn.createCreep([MOVE, MOVE, WORK, CARRY, CARRY]);
        }
    }
    
    
    
    for (var n in Game.creeps) {
        var creep = Game.creeps[n];
        if (creep.spawning)
            continue;
            
        var taskdest = Game.getObjectById(creep.memory.taskdest);
        
        if (creep.memory.task && Game.getObjectById(creep.memory.taskdest)) {
            var result = tasks[creep.memory.task](creep, taskdest);
            
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(taskdest, {reusePath : 10, serializeMemory : true});
            } else if (result == tasks.COMPLETED) {
                tasks.new(creep);
            }
        } else {
            tasks.new(creep);
        }
    }
}
