String.prototype.format = String.prototype.format || function() {
	let str = this.toString();
	if (arguments.length) {
		let t = typeof arguments[0];
		let key;
		let args = ("string" === t || "number" === t) ?
		    Array.prototype.slice.call(arguments)
			: arguments[0];
			
		for (key in args) {
			str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
		}
	}
	return str;
};
// let console = {log: function() {}};
let roles = {
	"harvester": {
		"makeBody": function(energyAvailable) {
			let cost = 150;
			let body = [MOVE, WORK];
			
			if (cost >= energyAvailable)
				return {"cost": cost, "body": body};

			let parts = [WORK];
			for (let i = 0; cost <= energyAvailable; i++) {
				let part = parts[i % parts.length];
				cost += BODYPART_COST[part];
				body.push(part);
			}
			cost -= BODYPART_COST[body.pop()];

			return {"cost": cost, "body": body};
		},
		"work": function(creep) { 
			let target = Game.getObjectById(creep.memory.targetId);
			if (target) {
				if (target.pos.isNearTo(creep)) {
					creep.harvest(target)
				} else {
					creep.moveTo(target);
				}
			} else {
				target = creep.room.find(FIND_SOURCES_ACTIVE)[0];
				if (target)
				    creep.memory.targetId = target.id;
				console.log("harvester {0}: now targets {1}".format(creep.name, target.id));
			}
		}
	},
	"upgrader": {
		"makeBody": function(energyAvailable) {
			let cost = 200;
			let body = [MOVE, WORK, CARRY];
			
			if (cost >= energyAvailable)
				return {"cost": cost, "body": body};
			
			let parts = [CARRY, MOVE, CARRY, WORK];
			for (let i = 0; cost <= energyAvailable; i++) {
				let part = parts[i % parts.length];
				cost += BODYPART_COST[part];
				body.push(part);
			}
			cost -= BODYPART_COST[body.pop()];

			return {"cost": cost, "body": body};
		},
		"work": function(creep) {
			if (creep.memory.working) {
				if (creep.pos.inRangeTo(creep.room.controller, 3))
					creep.upgradeController(creep.room.controller);
				else
					creep.moveTo(creep.room.controller);

				if (creep.carry[RESOURCE_ENERGY] == 0) {
					creep.memory.working = false;

					if (Game.getObjectById(creep.memory.targetId) instanceof Source)
						delete creep.memory.targetId;
				}
			} else {
				let target = Game.getObjectById(creep.memory.targetId);
				if (target) {
					if (target.pos.isNearTo(creep)) {
						if (target instanceof Resource) {
							creep.pickup(target)
						} else if (target instanceof Source) {
							creep.harvest(target)
						} else console.log("instanceof what?");
					} else {
						if (target instanceof Resource) {
							if (target.amount < 30)
								delete creep.memory.targetId;
						}
						creep.moveTo(target);
					}
				} else {
					let droppedEnergies = creep.room.find(FIND_DROPPED_RESOURCES);
					let targetId = null;
					for (let i = 0; i < droppedEnergies.length; i++) {
						let drop = droppedEnergies[i];

						if (drop.amount > creep.carryCapacity) {
							targetId = drop.id;
						}
					}
					if (!targetId) {
						let source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
						targetId = source.id;
					}
					
					creep.memory.targetId = targetId;
					console.log("upgrader {0}: now targets {1}".format(creep.name, creep.memory.targetId));
				}

				if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) creep.memory.working = true;
			}
		}
	},
	"builder": {
		"makeBody": function(energyAvailable) {
			let cost = 200;
			let body = [MOVE, WORK, CARRY];
			
			if (cost >= energyAvailable)
				return {"cost": cost, "body": body};
			
			let parts = [WORK, CARRY, MOVE];
			for (let i = 0; cost <= energyAvailable; i++) {
				let part = parts[i % parts.length];
				cost += BODYPART_COST[part];
				body.push(part);
			}
			cost -= BODYPART_COST[body.pop()];

			return {"cost": cost, "body": body};
		},
		"work": function(creep) {
			let target = Game.getObjectById(creep.memory.targetId);
			if (creep.memory.working) {
				if (target) {
					if (creep.pos.isNearTo(target.pos))
						if (target instanceof ConstructionSite)
							creep.build(target);
						else if (target instanceof Structure)
							creep.repair(target);
						else
							console.log("somehing funny going on!");
					else
						creep.moveTo(target);

					if (target.progress == target.progressTotal)
						delete creep.memory.targetId;
				} else {
					let sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
					
					let targetId = null;
					if (sites.length > 0) {
						targetId = sites[0].id;
					} else {
						let toRepair = creep.room.find(FIND_STRUCTURES);
						if (toRepair.length > 0) {
							for (let i = 0; i < toRepair.length; i++) {
								let repair = toRepair[i];
								console.log(repair.hits + "  /  " + repair.hitsMax);
								if (repair instanceof StructureWall || repair instanceof StructureRampart) {
									if (repair.hits < 1000) {
										targetId = repair.id;
										break;
									} else { continue; }
								} else if (repair.hits < repair.hitsMax) {
									targetId = repair.id;
									break;
								}
							}
						} else {
							console.log("no constuction to be done!");
							creep.memory.working = false;
						}
					}

					creep.memory.targetId = targetId;
				}

				if (creep.carry[RESOURCE_ENERGY] == 0) {
					creep.memory.working = false;
					delete creep.memory.targetId;
				}
			} else {
				let target = Game.getObjectById(creep.memory.targetId);
				if (target) {
					if (target.pos.isNearTo(creep)) {
						if (target instanceof Resource) {
							creep.pickup(target)
						} else if (target instanceof Source) {
							creep.harvest(target)
						} else console.log("instanceof what?");
					} else {
						if (target instanceof Resource) {
							if (target.amount < 30)
								delete creep.memory.targetId;
						}
						creep.moveTo(target);
					}
				} else {
					let droppedEnergies = creep.room.find(FIND_DROPPED_RESOURCES);
					let targetId = null;
					for (let i = 0; i < droppedEnergies.length; i++) {
						let drop = droppedEnergies[i];

						if (drop.amount > creep.carryCapacity) {
							targetId = drop.id;
						}
					}
					if (!targetId) {
						let source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
						targetId = source.id;
					}
					
					creep.memory.targetId = targetId;
					console.log("builder {0}: now targets {1}".format(creep.name, creep.memory.targetId));
				}

				if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
					creep.memory.working = true;
					delete creep.memory.targetId;
				}
			}
		}
	},
	"spawner": {
		"makeBody": function(energyAvailable) {
			let cost = 100;
			let body = [MOVE, CARRY];
			
			if (cost >= energyAvailable)
				return {"cost": cost, "body": body};
			
			let parts = [CARRY, MOVE];
			for (let i = 0; cost <= energyAvailable; i++) {
				let part = parts[i % parts.length];
				cost += BODYPART_COST[part];
				body.push(part);
			}
			cost -= BODYPART_COST[body.pop()];

			return {"cost": cost, "body": body};
		},
		"work": function(creep) {
			let target = Game.getObjectById(creep.memory.targetId);
			if (creep.memory.working) {
				if (target) {
					if (!(target instanceof StructureSpawn || target instanceof StructureExtension)) {
						delete creep.memory.targetId;
						return;
					}
					if (creep.pos.isNearTo(target.pos))
						creep.transfer(target, RESOURCE_ENERGY);
					else
						creep.moveTo(target);

					if (target.energy == target.energyCapacity)
						delete creep.memory.targetId;
				} else {
					let spawns = creep.room.find(FIND_MY_STRUCTURES,
							{filter: (s) => s.structureType == STRUCTURE_SPAWN
							    || s.structureType == STRUCTURE_EXTENSION});
					
					let targetId = null;
					for (let i = 0; i < spawns.length; i++) {
						let spawn = spawns[i];
						if (spawn.energy < spawn.energyCapacity) {
							targetId = spawn.id;
						}
					}

					if (!targetId) {
						console.log("All spawners full?");
						creep.memory.working = false;
						delete creep.memory.targetId;
					}
					creep.memory.targetId = targetId;
				}

				if (creep.carry[RESOURCE_ENERGY] == 0) {
					creep.memory.working = false;
					delete creep.memory.targetId;
				}
			} else {
				if (target) {
					if (target.pos.isNearTo(creep)) {
						if (target instanceof Resource) {
							creep.pickup(target)
						} else if (target instanceof Source) {
							creep.harvest(target)
						} else console.log("instanceof what?");
					} else {
						if (target instanceof Resource && target.amount < 30) {
							delete creep.memory.targetId;
						}
						creep.moveTo(target);
					}
				} else {
					let droppedEnergies = creep.room.find(FIND_DROPPED_RESOURCES,
					        {filter: (x) => x.resourceType == RESOURCE_ENERGY && x.amount > 20});
					let targetId = null;
					for (let i = 0; i < droppedEnergies.length; i++) {
						let drop = droppedEnergies[i];

						targetId = drop.id;
					}

					creep.memory.targetId = targetId;
					console.log("spawner {0}: now targets {1}".format(creep.name, targetId));

					if (!targetId) {
						creep.memory.working = true;
						delete creep.memory.targetId;
					}
				}

				if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
					creep.memory.working = true;
					delete creep.memory.targetId;
				}
			}
		}
	},
	"attacker": {
		"makeBody": function(energyAvailable) {
			let cost = 130;
			let body = [MOVE, ATTACK];
			
			if (cost >= energyAvailable)
				return {"cost": cost, "body": body};

			let parts = [MOVE, ATTACK];
			for (let i = 0; cost <= energyAvailable && cost < 400; i++) {
				let part = parts[i % parts.length];
				cost += BODYPART_COST[part];
				body.push(part);
			}
			cost -= BODYPART_COST[body.pop()];

			return {"cost": cost, "body": body};
		},
		"work": function(creep) { 
			let target = Game.flags["attack"];
			if (target) {
				if (target.pos.isNearTo(creep)) {
					let objects = creep.room.lookAt(target);
					let attacked = false;
					for (let i = 0; i < objects.length; i++) {
						let obj = objects[i];
						if (obj.type == "structure") {
							creep.attack(obj.structure);
							attacked = true;
						}
					}
					if (!attacked) console.log("need new attack flag!");
				} else {
					creep.moveTo(target);
				}
			} else {
				console.log("no attack flag");
			}
		}
	},
};

let createCreep = function(role, maxEnergy) {
	maxEnergy = maxEnergy || Game.spawns.Spawn1.room.energyAvailable;
	let creepInfo = roles[role].makeBody(maxEnergy);
	if (creepInfo.cost > maxEnergy) {
		console.log("Failed creating {0}. needs {1}, has {2}".format(role, creepInfo.cost, maxEnergy));
		console.log(creepInfo.body);
	} else {

		Game.spawns.Spawn1.spawnCreep(creepInfo.body,role + Game.time, {memory: {'role': role}});
	}
}

module.exports.loop = function() {
	for (let x in Memory.creeps) {
		if (!Game.creeps[x])
			delete Memory.creeps[x];
	}

	let counts = {harvester: 0, upgrader: 0, builder: 0, spawner: 0, attacker: 0};
	for (let x in Game.creeps) {
		x = Game.creeps[x];
		if (_.isUndefined(x.memory)) {
			x.memory = {role:"upgrader"};
		}

		if (roles[x.memory.role].work)
			roles[x.memory.role].work(x);
		else
			console.log("No work for '{0}'".format(x.memory.role));

		counts[x.memory.role]++;
	}

	if (counts["harvester"] < 2)
		createCreep("harvester");
	else if (counts["spawner"] < 2)
		createCreep("spawner");
	else if (counts["upgrader"] < 4)
		createCreep("upgrader");
	else if (counts["builder"] < 2)
		createCreep("builder");
	else if (counts["attacker"] < 1)
		createCreep("attacker");
}
