function Waypoint(waypointName, roomPosition) {
	this.roomName = roomPosition.roomName;
	this.name = waypointName;
	
	if (!Memory.waypoints)
		Memory.waypoints = {};
	
	if (!Memory.waypoints[roomName])
		Memory.waypoints[roomName] = {};
	
	Memory.waypoints[roomName][waypointName] = {
		x: roomPosition.x,
		y: roomPosition.y
	}
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
