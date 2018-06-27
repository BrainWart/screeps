module.exports.loop = function() {
    if (_.sum(Game.rooms, (room) => room.controller.my) == 1) {
        let room = _.find(Game.rooms);
        switch (room.controller.level) {
            default:
                Game.notify("WARNING: out of logic! Controller level: " + room.controller.level, 10);
            case 1:
            case 2: {
                _.forEach(Memory.creeps, (mem, name) => {
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
                            source: _.first(room.find(FIND_SOURCES_ACTIVE)).id
                        }
                    );
                }

                _.forEach(Game.creeps, (creep) => {
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
                                source = _.first(room.find(FIND_SOURCES_ACTIVE));
                        } else {
                            source = _.first(room.find(FIND_SOURCES_ACTIVE));
                        }

                        if (creep.pos.isNearTo(source))
                            creep.harvest(source);
                        else
                            creep.moveTo(source);

                        creep.memory.source = source.id;

                        if (_.sum(creep.carry) == creep.carryCapacity)
                            creep.memory.working = true;
                    }
                });
            } break;
        }
    }
}
