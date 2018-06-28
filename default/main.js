module.exports.loop = function() {
    if (_.sum(Game.rooms, (room) => room.controller.my) == 1) {
        let room = _.find(Game.rooms);
        switch (room.controller.level) {
            default:
                console.log("Room level not handled.");
            case 2:
                require("level2_main")();
                break;
            case 1:
                require("level1_main")();
                break;
        }
    }
}
