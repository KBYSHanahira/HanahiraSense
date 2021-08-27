
function main() {
    var watermark_name = Entity.GetName(Entity.GetLocalPlayer());
    var today = new Date();
    var hours1 = today.getHours();
    var minutes1 = today.getMinutes();
    var seconds1 = today.getSeconds();
    var localplayer_index = Entity.GetLocalPlayer();
    var velocity = Entity.GetProp(localplayer_index, "CBasePlayer", "m_vecVelocity[0]");
    var speed = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
    var finalspeed = Math.min(9999, speed) + 0.2
    var hours = hours1 <= 9 ? "0" + today.getHours() + ":" : today.getHours() + ":";
    var minutes = minutes1 <= 9 ? "0" + today.getMinutes() + ":" : today.getMinutes() + ":";
    var seconds = seconds1 <= 9 ? "0" + today.getSeconds() : today.getSeconds();
    const tickrate = Globals.Tickrate();
    const ping = Math.floor(Global.Latency() * 1000 / 1.5);
    const fps = Math.floor(1 / Global.Frametime());
    const fontpixel = Render.AddFont("Verdana", 7, 100);
    const fontpixel2 = Render.AddFont("Verdana", 8, 100);



    // Get our drawing properties
    const x = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "watermark_x"),
        y = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "watermark_y");
    const x1 = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "watermark_x1"),
        y1 = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "watermark_y1");

    // Rainbow color for our bar
    const rainbow = [
        Math.floor(Math.sin(Global.Realtime() * 2) * 127 + 128),
        Math.floor(Math.sin(Global.Realtime() * 2 + 2) * 127 + 128),
        Math.floor(Math.sin(Global.Realtime() * 2 + 4) * 127 + 128),
        255
    ];


    function HSVtoRGB(h, s, v) {
        var r, g, b, i, f, p, q, t;

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    // skeetwater by kymiko
    Render.FilledRect(x + 1570, y + 5, 335, 20, [15, 15, 15, 150]);
    Render.FilledRect(x + 1570, y + 5, 335, 2, [89, 119, 239, 255]);
    Render.StringCustom(x + 1574, y + 9, 0, "neverlose.cc | KuCJloTa1337 | delay: " + ping + "ms | " + tickrate + "tick | " + hours + minutes + seconds, [255, 255, 255, 255], fontpixel);


}
//endregion

//region callbacks

// Callback our main function
Global.RegisterCallback("Draw", "main")