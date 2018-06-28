function level1main() {
    let room = _.find(Game.spawns).room;
    _.forEach(Memory.creeps, function(mem, name) {
        if (Game.creeps[name] === undefined)
            delete Memory.creeps[name];
    })

    let spawn = _.find(Game.spawns);
    if (room.energyAvailable >= 300) {
        spawn.createCreep(
            [MOVE, MOVE, CARRY, CARRY, WORK],
            "basic" + (Game.time % 10000),
            {
                working: false,
                source: spawn.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
            }
        );
    }

    _.forEach(Game.creeps, function(creep) {
        if (creep.memory.working) {
            if (creep.pos.inRangeTo(room.controller, 3))
                creep.upgradeController(room.controller);
            else
                creep.moveTo(room.controller);

            if (creep.carry[RESOURCE_ENERGY] < 1)
                creep.memory.working = false;
        } else {
            let source = Game.getObjectById(creep.memory.source);
            if (source) {
                if (source.energy == 0)
                    source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            } else {
                source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            }

            if (creep.pos.isNearTo(source))
                creep.harvest(source);
            else
                if (creep.moveTo(source) == ERR_NO_PATH) {
                    console.log(creep.name + " couldn't move to desired source. reselecting.");
                    source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                }

            creep.memory.source = source.id;

            if (_.sum(creep.carry) == creep.carryCapacity)
                creep.memory.working = true;
        }
    });
}

module.exports = level1main;
