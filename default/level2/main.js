let actions = {
    upgrade: function(creep) {
        if (creep.pos.inRangeTo(creep.room.controller, 3))
            creep.upgradeController(creep.room.controller);
        else
            creep.moveTo(creep.room.controller);

        if (creep.carry[RESOURCE_ENERGY] < 1)
            creep.memory.actions.unshift("harvest");
    },
    spawn: function(creep) {
        let spawn = _.find(Game.spawns, (spawn) => spawn.room == creep.room);
        if (creep.pos.isNearTo(spawn))
            creep.transfer(spawn, RESOURCE_ENERGY);
        else
            creep.moveTo(spawn);

        if (creep.carry[RESOURCE_ENERGY] < 1)
            creep.memory.actions.unshift("harvest");
    },
    build: function(creep) {
        if (creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.actions.unshift("harvest");
            return;
        }
    },
    harvest: function(creep) {
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
            creep.memory.actions.shift();
    }
}

let counts = {
    ["upgrader"]: 0,
    ["spawner"]: 0,
    ["builder"]: 0
};

_.forEach(Game.creeps, function(creep) {
    if (!(creep.memory.role === undefined)) {
        counts[creep.memory.role] += 1;
    }
});

function assignRole(creep) {
    if (counts.upgrader < 3) {
        counts.upgrader += 1;
        creep.memory.role = "upgrader";
        creep.memory.actions = ["upgrade"];
    } else if (counts.spawner < 2) {
        counts.spawner += 1;
        creep.memory.role = "spawner";
        creep.memory.actions = ["spawn"];
    } else if (counts.builder < 3) {
        counts.builder += 1;
        creep.memory.role = "builder";
        creep.memory.actions = ["build"];
    }
}

function level2main() {
    let spawn = _.find(Game.spawns);
    let room = spawn.room;

    _.forEach(Memory.creeps, function(mem, name) {
        if (Game.creeps[name] === undefined)
            delete Memory.creeps[name];
    })

    _.forEach(Game.creeps, function(creep) {
        if (creep.memory.role === undefined) {
            assignRole(creep);
            console.log(creep.name + " is now a " + creep.memory.role);
        }

        actions[_.first(creep.memory.actions)](creep);
    });
}

module.exports = level2main;
