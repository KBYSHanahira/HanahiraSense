UI.AddCheckbox("[EXP] Grenade Proximity")
UI.AddDropdown("[EXP] Grenade Proximity Mode", ["Grenade Warning", "Grenade Radius", "Combined"])
UI.AddColorPicker("Radius Color")
UI.AddCheckbox("[EXP] Grenade Trail")
UI.AddColorPicker("Trail color")

var lines = []
var hits = []
var pmolotov = []
var tracer_lines = []
var setid = "m_nForceBone"
var name = "m_nBody"
var name2 = "CBaseCSGrenadeProjectile"
var id = 1


function getLocal() {
    return Entity.GetRenderOrigin(Entity.GetLocalPlayer());
}

const vectorDistance = function(vec, vec2) {
    dx = vec[0] - vec2[0]
    dy = vec[1] - vec2[1]
    dz = vec[2] - vec2[2]
    return Math.abs(Math.sqrt(dx * dx + dy * dy + dz * dz));
}


function menusetup() 
{
    UI.SetEnabled("Script items", "Trail color", UI.GetValue("Script items", "[EXP] Grenade Trail"))
    UI.SetEnabled("Script items", "[EXP] Grenade Proximity Mode", UI.GetValue("Script items", "[EXP] Grenade Proximity"))
    if (!UI.GetValue("Script items", "[EXP] Grenade Proximity Mode") == 0){
        UI.SetEnabled("Script items", "Radius Color",1)
    } else {
        UI.SetEnabled("Script items", "Radius Color",0)
    }
}

Cheat.RegisterCallback( 'Draw', 'menusetup' )

function radians_to_degrees( radians ) { return radians * ( 180 / Math.PI ); }

// https://www.onetap.com/threads/release-shitty-circular-molotov-esp.13186/
function draw_circle_3d(x, y, z, radius, degrees, degrees_outline, start_at, clr, filled, fill_clr) {
    var accuracy = 5;
    var old_x, old_y;
    start_at = start_at + 1
    for (rot = start_at; rot < degrees + start_at + 1; rot += accuracy) {
        rot_r = rot * (Math.PI / 180)
        line_x = radius * Math.cos(rot_r) + x, line_y = radius * Math.sin(rot_r) + y
        var curr = Render.WorldToScreen([line_x, line_y, z]),
            cur = Render.WorldToScreen([x, y, z]);
        if (cur[0] != null && curr[0] != null && old_x != null) {
            if (filled) Render.Polygon([
                [curr[0], curr[1]],
                [old_x, old_y],
                [cur[0], cur[1]]
            ], fill_clr)
        }
        old_x = curr[0], old_y = curr[1];
    }
    for (rot = start_at; rot < degrees_outline + start_at + 1; rot += accuracy) {
        rot_r = rot * (Math.PI / 180)
        line_x = radius * Math.cos(rot_r) + x, line_y = radius * Math.sin(rot_r) + y
        var curr = Render.WorldToScreen([line_x, line_y, z]),
            cur = Render.WorldToScreen([x, y, z]);
        if (cur[0] != null && curr[0] != null && old_x != null) {
            Render.Line(curr[0], curr[1], old_x, old_y, clr)
        }
        old_x = curr[0], old_y = curr[1];
    }
}

function grenade_warning_tick() {
    entities = Entity.GetEntitiesByClassID(9).concat(Entity.GetEntitiesByClassID(114));
    for (var i = 0; i < entities.length; i++) {
        entity = entities[i]
        if (Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_nExplodeEffectTickBegin') == 0) {
            Entity.SetProp(entity, name2, name, Entity.GetProp(entity, name2, name) + 1)
        }
    }
    if (entities.length == 0) {
        hits = []
        lines = []
        pmolotov = []
    }
    entities = Entity.GetEntitiesByClassID(9)
    for (var i = 0; i < entities.length; i++) {
        entity = entities[i]
        var vel = Entity.GetProp(entity, 'CBaseGrenade', 'm_vecVelocity');
        if (Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_flAnimTime') != Math.round(vel[0]) && Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_nExplodeEffectTickBegin') == 0) {
            Entity.SetProp(entity, 'CBaseCSGrenade', 'm_flAnimTime', Math.round(vel[0]))
            var mx = vel[0] * 0.015
            var my = vel[2] * 0.015
            var mz = vel[1] * 0.015
            Entity.SetProp(entity, 'CBaseCSGrenadeProjectile', setid, id)
            id++
            var x = Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_vecOrigin')[0]
            var y = Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_vecOrigin')[2]
            var z = Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_vecOrigin')[1]
            var hittable = false
            for (var i = 0; i < 109 - Entity.GetProp(entity, name2, name); i++) {
                my = my - 0.0712
                var hit = []
                var hitbox = [
                    [
                        [x - 2, z - 2, y - 2],
                        [x + mx - 2, z + mz - 2, y + my - 2]
                    ],
                    [
                        [x - 2, z - 2, y + 2],
                        [x + mx - 2, z + mz - 2, y + my + 2]
                    ],
                    [
                        [x + 2, z + 2, y - 2],
                        [x + mx + 2, z + mz + 2, y + my - 2]
                    ],
                    [
                        [x + 2, z + 2, y + 2],
                        [x + mx + 2, z + mz + 2, y + my + 2]
                    ]
                ]
                for (var v = 0; v < hitbox.length; v++) {
                    var h = hitbox[v]
                    var res = 0
                    res = Trace.Line(entity, h[0], h[1])[1]
                    if (res != 1) {
                        var ny = h[0][2] + 10
                        var nx = h[1][0]
                        var nz = h[1][1]
                        var fny = h[0][2]
                        var fnx = h[1][0]
                        var fnz = h[1][1]
                        vres = Trace.Line(entity, [fnx, fnz, fny], [nx, nz, ny])[1]
                        var start = [x, z, y]
                        var end = [x - mx, z - mz, y - 30]
                        vres1 = Trace.Line(entity, start, end)[1]
                        if (vres == 1 && vres1 == 1) {
                            hittable = true
                            hit = [x + mx * (res), z + mz * (res), y + my * (res)]
                            break;
                        } else {
                            my = my * -0.45
                            mx = mx * 0.45
                            mz = mz * 0.45
                            break
                        }
                    }
                }
                if (hit.length > 1) {
                    hits.push([
                        [hit[0], hit[1], hit[2]], Globals.Tickcount() + i, false, Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_flAnimTime'), Globals.Tickcount()
                    ])
                    break;
                }
               lines.push([
                        [x, z, y],
                        [x + mx, z + mz, y + my], Globals.Tickcount() + i, Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_flAnimTime')
                    ])
                x = x + mx
                y = y + my
                z = z + mz
            }
            if (!hittable) {
                hits.push([
                    [x, z, y], Globals.Tickcount() + i, false, Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_flAnimTime'), Globals.Tickcount()
                ])
            }
        }
    }
    entities = Entity.GetEntitiesByClassID(114)
    for (var i = 0; i < entities.length; i++) {
        entity = entities[i]

        var vel = Entity.GetProp(entity, 'CBaseGrenade', 'm_vecVelocity');
        if (Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_flAnimTime') != Math.round(vel[0]) && Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_nExplodeEffectTickBegin') == 0) {
            Entity.SetProp(entity, 'CBaseCSGrenade', 'm_flAnimTime', Math.round(vel[0]))
            var mx = vel[0] * 0.015
            var my = vel[2] * 0.015
            var mz = vel[1] * 0.015
            Entity.SetProp(entity, 'CBaseCSGrenadeProjectile', setid, id)
            id++

            var x = Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_vecOrigin')[0]
            var y = Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_vecOrigin')[2]
            var z = Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_vecOrigin')[1]
            var hittable = false
            for (var i = 0; i < 130 - Entity.GetProp(entity, name2, name); i++) {
                my = my - 0.0712
                var hit = []
                var hitbox = [
                    [
                        [x - 2, z - 2, y - 2],
                        [x + mx - 2, z + mz - 2, y + my - 2]
                    ],
                    [
                        [x - 2, z - 2, y + 2],
                        [x + mx - 2, z + mz - 2, y + my + 2]
                    ],
                    [
                        [x + 2, z + 2, y - 2],
                        [x + mx + 2, z + mz + 2, y + my - 2]
                    ],
                    [
                        [x + 2, z + 2, y + 2],
                        [x + mx + 2, z + mz + 2, y + my + 2]
                    ]
                ]
                for (var v = 0; v < hitbox.length; v++) {
                    var h = hitbox[v]
                    var res = 0
                    res = Trace.Line(entity, h[0], h[1])[1]
                    if (res != 1) {
                        var ny = h[0][2] + 10
                        var nx = h[1][0]
                        var nz = h[1][1]
                        var fny = h[0][2]
                        var fnx = h[1][0]
                        var fnz = h[1][1]
                        vres = Trace.Line(entity, [fnx, fnz, fny], [nx, nz, ny])[1]
                        var start = [x, z, y]
                        var end = [x - mx, z - mz, y - 20]
                        vres1 = Trace.Line(entity, start, end)[1]
                        if (vres == 1 && vres1 == 1) {
                            hittable = true
                            hit = [x + mx * (res), z + mz * (res), y + my * (res)]
                            break;
                        } else {
                            if (vres1 != 1) {
                                pmolotov.push([
                                    [x, z, y], Globals.Tickcount(), Globals.Tickcount() + i, Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_flAnimTime')
                                ])
                                hits.push([
                                    [x, z, y], Globals.Tickcount() + i, true, Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_flAnimTime')
                                ])
                                return
                            }
                            my = my * -0.45
                            mx = mx * 0.45
                            mz = mz * 0.45
                            break
                        }
                    }
                }
                if (hit.length > 1) {
                    hits.push([
                        [hit[0], hit[1], hit[2]], Globals.Tickcount() + i, true, Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_flAnimTime'), Globals.Tickcount()
                    ])
                    break;
                }
               lines.push([
                        [x, z, y],
                        [x + mx, z + mz, y + my], Globals.Tickcount() + i, Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_flAnimTime')
                    ])
                x = x + mx
                y = y + my
                z = z + mz
            }
            if (!hittable) {
                hits.push([
                    [x, z, y], Globals.Tickcount() + i, true, Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_flAnimTime'), Globals.Tickcount()
                ])
            }
        }
    }
    const contains = function(arr, contain) {
        for (var i = 0; i < arr.length; i++) {
            var object = arr[i]
            if (object == contain) {
                return true
            }
        }
        return false;
    }
    entities = Entity.GetEntitiesByClassID(9).concat(Entity.GetEntitiesByClassID(114));
    var array = []
    for (var i = 0; i < entities.length; i++) {
        entity = entities[i]
        if (Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_nExplodeEffectTickBegin') == 0) {
            array.push(Entity.GetProp(entity, 'CBaseCSGrenadeProjectile', 'm_flAnimTime'))
        }
    }
    for (var i = 0; i < hits.length; i++) {
        var object = hits[i]
        if (!contains(array, object[3])) {
            hits[i][1] = 0;
        }
    }
    for (var i = 0; i < lines.length; i++) {
        var object = lines[i]
        if (!contains(array, object[3])) {
            lines[i][2] = 0;
        }
    }
    for (var i = 0; i < pmolotov.length; i++) {
        var object = pmolotov[i]
        if (!contains(array, object[3])) {
            pmolotov[i][2] = 1;
            pmolotov[i][1] = -5;
        }
    }
}

function draw_warning(xzy) {
    var x = Render.WorldToScreen(xzy[0])[0]
    var y = Render.WorldToScreen(xzy[0])[1]
    var circle_color = [0,0,0,190];
    const draw_ind = function(x, y, alpha, str, oof, xzy) {
        var distance = Math.round(vectorDistance(getLocal(), xzy) / 50)
        if (distance > 25) return;
        Render.FilledCircle(x, y, oof ? (21 + Globals.Tickcount() / 7 % 5) : 25, distance<6 ? [235, 64, 52, 255] : circle_color)
        Render.String(x-8.8, y-15.6, 0, str, distance<6 ? [255,255,255,255] : [119, 121, 79, 255], 5)
        Render.String(x-9.2, y+5.6, 0, distance + " m", [255, 255, 255, 255], 2)
    }
    var str = xzy[2] ? "K" : "I";
    var alpha = (xzy[1] - Globals.Tickcount()) * 2
    if (alpha < 1)
        return;
    size = Render.GetScreenSize()


    if (x < 0 || x > size[0] || y > size[1] || y < 0) {
        var yaw = (Local.GetViewAngles()[1])
            var myorig = Entity.GetRenderOrigin(Entity.GetLocalPlayer())
            var orig = xzy[0]
            var x = orig[0] - myorig[0]
            var z = orig[1] - myorig[1]
            var atan = Math.atan2(z, x)
            var deg = atan * (180 / Math.PI);
            deg -= yaw + 90;
            atan = deg / 180 * Math.PI;
            var cos = Math.cos(atan) * -1
            var sin = Math.sin(atan)
            draw_ind(size[0] / 2 + cos * 150, size[1] / 2 + sin * 150, 255, str, true, xzy[0])
    } else {
        draw_ind(x, y, 255, str, false, xzy[0])
    }
}

function draw() {
    var colorcircle = UI.GetColor("Script items", "Radius Color")
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i]
        var alpha = (line[2] - Globals.Tickcount())
        if (alpha > 0) {
            size = Render.GetScreenSize()
            var line_color = UI.GetColor("Script items", "Trail color")
            if (Render.WorldToScreen(line[1])[1] > 0 && Render.WorldToScreen(line[0])[1] > 0 && Render.WorldToScreen(line[1])[1] < size[1] && Render.WorldToScreen(line[0])[1] < size[1] && UI.GetValue("Script items", "[EXP] Grenade Trail")) {
                Render.Line(Render.WorldToScreen(line[0])[0], Render.WorldToScreen(line[0])[1], Render.WorldToScreen(line[1])[0], Render.WorldToScreen(line[1])[1], line_color)
                Render.Line(Render.WorldToScreen(line[0])[0], Render.WorldToScreen(line[0])[1], Render.WorldToScreen(line[1])[0], Render.WorldToScreen(line[1])[1], line_color)
                Render.Line(Render.WorldToScreen(line[0])[0], Render.WorldToScreen(line[0])[1], Render.WorldToScreen(line[1])[0], Render.WorldToScreen(line[1])[1], [line_color[0], line_color[1], line_color[2], 190])
                Render.Line(Render.WorldToScreen(line[0])[0], Render.WorldToScreen(line[0])[1], Render.WorldToScreen(line[1])[0], Render.WorldToScreen(line[1])[1], [line_color[0], line_color[1], line_color[2], 190])
                Render.Line(Render.WorldToScreen(line[0])[0], Render.WorldToScreen(line[0])[1], Render.WorldToScreen(line[1])[0], Render.WorldToScreen(line[1])[1], line_color)
                Render.Line(Render.WorldToScreen(line[0])[0], Render.WorldToScreen(line[0])[1], Render.WorldToScreen(line[1])[0], Render.WorldToScreen(line[1])[1], line_color)
                Render.Line(Render.WorldToScreen(line[0])[0], Render.WorldToScreen(line[0])[1], Render.WorldToScreen(line[1])[0], Render.WorldToScreen(line[1])[1], line_color)
                Render.Line(Render.WorldToScreen(line[0])[0], Render.WorldToScreen(line[0])[1], Render.WorldToScreen(line[1])[0], Render.WorldToScreen(line[1])[1], line_color)
            }
        }
    }
    for (var i = 0; i < hits.length; i++) {
        var line = hits[i]
               if(UI.GetValue("Script items", "[EXP] Grenade Proximity") && !UI.GetValue("Script items", "[EXP] Grenade Proximity Mode") == 1){
                draw_warning(line)
      }
      if(UI.GetValue("Script items", "[EXP] Grenade Proximity") && UI.GetValue("Script items", "[EXP] Grenade Proximity Mode") == 2){
        draw_warning(line)
}
    }
    

    for (var i = 0; i < pmolotov.length; i++) {
        var molotov = pmolotov[i]
        var xzy = molotov[0]
        var start_timer = molotov[1]
        var end_timer = molotov[2]
        var curr = Globals.Tickcount()
        var max = end_timer - start_timer
        var cur = end_timer - curr
        var proc = cur / max * 300
        if (proc > 0 && UI.GetValue("Script items", "[EXP] Grenade Proximity") && !UI.GetValue("Script items", "[EXP] Grenade Proximity Mode") == 0 )
           draw_circle_3d(xzy[0], xzy[1], xzy[2], 130, 360, proc, 30, [colorcircle[0], colorcircle[1], colorcircle[2], 200], true, [colorcircle[0], colorcircle[1], colorcircle[2], 50])
}
}



Cheat.RegisterCallback( 'CreateMove', 'grenade_warning_tick' )
Cheat.RegisterCallback( 'Draw', 'draw' )
