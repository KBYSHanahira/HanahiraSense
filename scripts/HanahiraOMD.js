var binlib = {};
function dictLength(dict) {
    var count = 0;
    for (_ in dict) {
        count++;
    }
    return count;
}
createDropdown = function (name, values, multi) {
    UI[multi ? "AddMultiDropdown" : "AddDropdown"](name, values);

    binlib[name] = { "multi": multi, "values": {} };

    multi && values.reverse();

    var i = 0; for (value in values) {
        var index = multi ? (1 << (values.length - (i + 1))) : i;
        binlib[name].values[index] = values[value];
        i++;
    }
}
fetchDropdown = function (name) {
    var selection = (name ? [] : {})
    var bin = UI.GetValue("Misc", name);

    !name && function () { for (dropdown in binlib) selection[dropdown] = fetchDropdown(dropdown) }();

    if (name) {
        !binlib[name].multi && bin == 0 && selection.push(binlib[name].values[0]) && function () { return selection; }();
        for (var i = dictLength(binlib[name].values) - 1; i >= 0; i--) {
            if (!binlib[name].multi && i == 0) continue;

            var index = binlib[name].multi ? (1 << i) : i;
            if (bin - index >= 0) {
                bin -= (index);
                selection.push(binlib[name].values[index]);
            }
        }
    }

    return selection;
}

var pistolNames = ["usp s", "cz75 auto", "dual berettas", "dual berettas", "five seven", "glock 18", "p200", "p250", "tec 9"]
var heavypistolNames = ["desert eagle", "r8 revolver"]
var autosniperNames = ["scar 20", "g3sg1"]

function WeaponCFG(pMin, pOriginalmin) {
    this.min = pMin;
    this.omin = pOriginalmin;
}
var setOnce = false;
function handleDamage() {
    if (UI.IsMenuOpen()) {
        if (UI.IsHotkeyActive('Misc', 'JAVASCRIPT', 'Script items', "override hotkey")) {
            UI.ToggleHotkey('Misc', 'JAVASCRIPT', 'Script items', "override hotkey")
        }
        if (!setOnce) {
            UI.SetValue("Rage", "PISTOL", "Targeting", "Minimum damage", pistol.omin)
            UI.SetValue("Rage", "HEAVY PISTOL", "Targeting", "Minimum damage", heavypistol.omin)
            UI.SetValue("Rage", "SCOUT", "Targeting", "Minimum damage", scout.omin)
            UI.SetValue("Rage", "AWP", "Targeting", "Minimum damage", awp.omin)
            UI.SetValue("Rage", "AUTOSNIPER", "Targeting", "Minimum damage", autosniper.omin)
            UI.SetValue("Rage", "GENERAL", "Targeting", "Minimum damage", general.omin)
            setOnce = true;
        }
        general.omin = UI.GetValue("Rage", "GENERAL", "Targeting", "Minimum damage")
        pistol.omin = UI.GetValue("Rage", "PISTOL", "Targeting", "Minimum damage")
        heavypistol.omin = UI.GetValue("Rage", "HEAVY PISTOL", "Targeting", "Minimum damage")
        scout.omin = UI.GetValue("Rage", "SCOUT", "Targeting", "Minimum damage")
        awp.omin = UI.GetValue("Rage", "AWP", "Targeting", "Minimum damage")
        autosniper.omin = UI.GetValue("Rage", "AUTOSNIPER", "Targeting", "Minimum damage")


        general.min = UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "general override")
        pistol.min = UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "pistol override")
        heavypistol.min = UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "heavy pistol override")
        scout.min = UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "scout override")
        awp.min = UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "awp override")
        autosniper.min = UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "autosniper override")
    }
    else {
        if (UI.IsHotkeyActive('Misc', 'JAVASCRIPT', 'Script items', "override hotkey")) {
            UI.SetValue("Rage", "PISTOL", "Targeting", "Minimum damage", pistol.min)
            UI.SetValue("Rage", "HEAVY PISTOL", "Targeting", "Minimum damage", heavypistol.min)
            UI.SetValue("Rage", "SCOUT", "Targeting", "Minimum damage", scout.min)
            UI.SetValue("Rage", "AWP", "Targeting", "Minimum damage", awp.min)
            UI.SetValue("Rage", "AUTOSNIPER", "Targeting", "Minimum damage", autosniper.min)
            UI.SetValue("Rage", "GENERAL", "Targeting", "Minimum damage", general.min)

        }
        else {
            UI.SetValue("Rage", "PISTOL", "Targeting", "Minimum damage", pistol.omin)
            UI.SetValue("Rage", "HEAVY PISTOL", "Targeting", "Minimum damage", heavypistol.omin)
            UI.SetValue("Rage", "SCOUT", "Targeting", "Minimum damage", scout.omin)
            UI.SetValue("Rage", "AWP", "Targeting", "Minimum damage", awp.omin)
            UI.SetValue("Rage", "AUTOSNIPER", "Targeting", "Minimum damage", autosniper.omin)
            UI.SetValue("Rage", "GENERAL", "Targeting", "Minimum damage", general.omin)
        }
        setOnce = false;
    }
}
function handleMenu() {
    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "general override", false);
    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "pistol override", false);
    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "heavy pistol override", false);
    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "scout override", false);
    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "awp override", false);
    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "autosniper override", false);
    var selected = fetchDropdown("Weapon type")
    if (selected.indexOf("general") != -1) {
        UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "general override", true);
    }
    else if (selected.indexOf("pistol") != -1) {
        UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "pistol override", true);
    }
    else if (selected.indexOf("heavy pistol") != -1) {
        UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "heavy pistol override", true);
    }
    else if (selected.indexOf("scout") != -1) {
        UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "scout override", true);
    }
    else if (selected.indexOf("awp") != -1) {
        UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "awp override", true);
    }
    else if (selected.indexOf("autosniper") != -1) {
        UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "autosniper override", true);
    }

}
function handleDraw() {
    var screenSize = Render.GetScreenSize();
    var weaponName = Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer()))
    var color = UI.GetColor('Misc', 'JAVASCRIPT', 'Script items', "override indicator color")
    if (!UI.IsMenuOpen()) {
        if (pistolNames.indexOf(weaponName) != -1) {
            Render.String(screenSize[0] / 2 + 7, screenSize[1] / 2 + 7, 0, UI.GetValue("Rage", "PISTOL", "Targeting", "Minimum damage").toString(), color, 12);
        }
        else if (heavypistolNames.indexOf(weaponName) != -1) {
            Render.String(screenSize[0] / 2 + 7, screenSize[1] / 2 + 7, 0, UI.GetValue("Rage", "HEAVY PISTOL", "Targeting", "Minimum damage").toString(), color, 12);
        }
        else if (weaponName == "ssg 08") {
            Render.String(screenSize[0] / 2 + 7, screenSize[1] / 2 + 7, 0, UI.GetValue("Rage", "SCOUT", "Targeting", "Minimum damage").toString(), color, 12);
        }
        else if (weaponName == "awp") {
            Render.String(screenSize[0] / 2 + 7, screenSize[1] / 2 + 7, 0, UI.GetValue("Rage", "AWP", "Targeting", "Minimum damage").toString(), color, 12);
        }
        else if (autosniperNames.indexOf(weaponName) != -1) {
            Render.String(screenSize[0] / 2 + 7, screenSize[1] / 2 + 7, 0, UI.GetValue("Rage", "AUTOSNIPER", "Targeting", "Minimum damage").toString(), color, 12);
        }
        else {
            Render.String(screenSize[0] / 2 + 7, screenSize[1] / 2 + 7, 0, UI.GetValue("Rage", "GENERAL", "Targeting", "Minimum damage").toString(), color, 12);
        }
    }
}



function main() {
    UI.AddHotkey("override hotkey")
    UI.AddColorPicker("override indicator color");
    createDropdown("Weapon type", ["general", "pistol", "heavy pistol", "scout", "awp", "autosniper"], false);
    UI.AddSliderInt("general override", 0, 130);
    UI.AddSliderInt("pistol override", 0, 130);
    UI.AddSliderInt("heavy pistol override", 0, 130);
    UI.AddSliderInt("scout override", 0, 130);
    UI.AddSliderInt("awp override", 0, 130);
    UI.AddSliderInt("autosniper override", 0, 130);

    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "general override", false);
    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "pistol override", false);
    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "heavy pistol override", false);
    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "scout override", false);
    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "awp override", false);
    UI.SetEnabled('Misc', 'JAVASCRIPT', 'Script items', "autosniper override", false);



    general = new WeaponCFG(UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "general override"), UI.GetValue("Rage", "GENERAL", "Targeting", "Minimum damage"))
    pistol = new WeaponCFG(UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "pistol override"), UI.GetValue("Rage", "PISTOL", "Targeting", "Minimum damage"))
    heavypistol = new WeaponCFG(UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "heavy pistol override"), UI.GetValue("Rage", "HEAVY PISTOL", "Targeting", "Minimum damage"))
    scout = new WeaponCFG(UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "scout override"), UI.GetValue("Rage", "SCOUT", "Targeting", "Minimum damage"))
    awp = new WeaponCFG(UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "awp override"), UI.GetValue("Rage", "AWP", "Targeting", "Minimum damage"))
    autosniper = new WeaponCFG(UI.GetValue('Misc', 'JAVASCRIPT', 'Script items', "autosniper override"), UI.GetValue("Rage", "AUTOSNIPER", "Targeting", "Minimum damage"))

    Cheat.RegisterCallback("Draw", "handleDamage")
    Cheat.RegisterCallback("Draw", "handleMenu")
    Cheat.RegisterCallback("Draw", "handleDraw")
}
main();