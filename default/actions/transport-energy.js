function action() {
    return {
        role: action.role,
        actions: [action.type]
    }
}

function act(creep) {
}

action.type = "transport-energy";
action.role = "transporter-energy";
action.act = act;

module.exports = action;

