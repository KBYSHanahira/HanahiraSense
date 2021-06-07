var height = Render.GetScreenSize()[1];
var hitchance = ""

UI.AddCheckbox("DT Indicator");
UI.AddCheckbox("FD Indicator");
UI.AddCheckbox("BAIM Indicator");
UI.AddCheckbox("Damage Log");

function render() {
    font = Render.AddFont("Verdana", 18, 700);

    //Bodyaim Indicator

    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "BAIM Indicator")) {

        if (UI.IsHotkeyActive("Rage", "General", "Force body aim")) {
            Render.StringCustom(3, height - 440, 0, "BODY", [0, 0, 0, 255], font);
            Render.StringCustom(4, height - 440, 0, "BODY", [163, 240, 41, 255], font);
        } else {
            Render.StringCustom(3, height - 440, 0, "BODY", [0, 0, 0, 255], font);
            Render.StringCustom(4, height - 440, 0, "BODY", [242, 29, 29, 255], font);
        }
    }

    //Doubletap Indicator

    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "DT Indicator")) {
        if (UI.IsHotkeyActive("Rage", "GENERAL", "Exploits", "Doubletap")) {
            Render.StringCustom(3, height - 500, 0, "DT", [0, 0, 0, 255], font);
            Render.StringCustom(4, height - 500, 0, "DT", [163, 240, 41, 255], font);
        } else {
            Render.StringCustom(3, height - 500, 0, "DT", [0, 0, 0, 255], font);
            Render.StringCustom(4, height - 500, 0, "DT", [242, 29, 29, 255], font);
        }
    }

    //Fakeduck Indicator

    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "FD Indicator")) {
        if (UI.IsHotkeyActive("Anti-Aim", "Extra", "Fake duck")) {
            Render.StringCustom(3, height - 470, 0, "FD", [0, 0, 0, 255], font);
            Render.StringCustom(4, height - 470, 0, "FD", [163, 240, 41, 255], font);
        } else {
            Render.StringCustom(3, height - 470, 0, "FD", [0, 0, 0, 255], font);
            Render.StringCustom(4, height - 470, 0, "FD", [242, 29, 29, 255], font);
        }
    }
}
Cheat.RegisterCallback("Draw", "render")

hitboxes = [
    ' with a nade',
    ' in the head',
    ' in the chest',
    ' in the stomach',
    ' in the left arm',
    ' in the right arm',
    ' in the left leg',
    ' in the right leg',
    ' in the body'
];

function getHitboxName(index) {
    return hitboxes[index] || 'Generic';
}

function hitlog() {

    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Damage Log")) {

        localPlayer = Entity.GetLocalPlayer();
        attacker = Entity.GetEntityFromUserID(Event.GetInt('attacker'));
        victim = Entity.GetName(Entity.GetEntityFromUserID(Event.GetInt('userid')));

        hitgroup = getHitboxName(Event.GetInt('hitgroup'));
        damage = Event.GetInt("dmg_health");

        if (localPlayer == attacker) {
            Global.PrintChat(" \x04[Raphael] \x01hurt \x04 " + victim + " \x01for " + damage + hitgroup + (hitgroup == " with a nade" ? "" : "\n (Hitchance: " + hitchance + ")"));
        }
    }
}
Global.RegisterCallback("player_hurt", "hitlog");

function updateHitchance() {
    hitchance = Event.GetInt("hitchance");
}
Cheat.RegisterCallback("ragebot_fire", "updateHitchance")