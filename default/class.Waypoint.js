function Waypoint(waypointName, roomName, x, y) {
	this.name = waypointName;
	this.roomName = roomName;

	if (!Memory.waypoints)
		Memory.waypoints = {};
	
	if (!Memory.waypoints[roomName])
		Memory.waypoints[roomName] = {};
	
	Memory.waypoints[this.roomName][waypointName] = {
		"x": x,
		"y": y
	}
}
Waypoint.fromRoomPosition = function(waypointName, roomPosition) {
	return new Waypoint(waypointName, roomPosition.roomName, roomPosition.x, roomPosition.y);
}
Waypoint.fromFlag = function(flag) {
	return new Waypoint(flag.name, flag.pos.roomName, flag.pos.x, flag.pos.y);
}

Object.defineProperty(Waypoint.prototype, "x", {
	set: function(x) { Memory.waypoints[this.roomName][this.name].x = x; },
	get: function() { return Memory.waypoints[this.roomName][this.name].x; } });
Object.defineProperty(Waypoint.prototype, "y", {
	set: function(y) { Memory.waypoints[this.roomName][this.name].y = y; },
	get: function() { return Memory.waypoints[this.roomName][this.name].y; } });

Waypoint.allInRoom = function(roomName) {
	let waypoints = [];
	// for (let rn in Memory.waypoints[roomName])
}

module.exports = Waypoint;
