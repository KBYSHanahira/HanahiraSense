var real_types = ["Fake", "Opposing fake", "Middle", "Smart Middle", "Follow Fake", "Opposing Follow Fake", "Smart", "Opposite Smart"]
var lby_types = ["Opposite", "Middle", "Switch Opposite", "Smart", "Opposite Smart"] // not much you can do with lby but opposite is best
var real_additional_types = ["None", "Full Sine", "Full Jitter", "Half Sine", "Half Jitter"]
var moving_real_types = ["None", "Switch", "Jitter", "Sine"]
var override = UI.AddCheckbox("Override Anti-Aim")
var ui = {
    real_type : UI.AddDropdown("Real type", real_types),
    lby_type : UI.AddDropdown("LBY type", lby_types),
    real_additional_type : UI.AddDropdown("Real additional type", real_additional_types),
    moving_real_type : UI.AddDropdown("Moving real type", moving_real_types),
    smart_range : UI.AddSliderInt("Smart Range", 0, 100)
}
function LBY_opposite(inverter) // inverter is just side basically
{
    var real = Local.GetRealYaw()
    var fake = Local.GetFakeYaw()
    var local = Entity.GetLocalPlayer()
    var yaw = Entity.GetProp(local, "CCSPlayer", "m_angEyeAngles[0]")[1]
    var delta = yaw - fake
    if(delta > 180)
        delta -= 360
    if(delta < -180)
        delta += 360

    if(delta > -20 && inverter)
    {
        AntiAim.SetLBYOffset(90)
        return 90
    }
    else if (delta < 20 && !inverter)
    {
        AntiAim.SetLBYOffset(-90)
        return -90
    }
    else {
        AntiAim.SetLBYOffset(180)
        return 180
    }
}
function smart_middle(inverter)
{
    var local = Entity.GetLocalPlayer()
    var v = Entity.GetProp(local, "CBasePlayer", "m_vecVelocity[0]")
    var len = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])
    AntiAim.SetRealOffset(len < 30 ? 0 : (inverter ? 58 : -58))
    return len < 30 ? 0 : (inverter ? 58 : -58)
}
function follow_fake(inverter, a)
{
    var real = Local.GetRealYaw()
    var fake = Local.GetFakeYaw()
    var local = Entity.GetLocalPlayer()
    var yaw = Entity.GetProp(local, "CCSPlayer", "m_angEyeAngles[0]")[1]
    var delta = yaw - fake
    if(delta > 180)
        delta -= 360
    if(delta < -180)
        delta += 360
    AntiAim.SetRealOffset(a ? delta : -delta)
    return a ? delta : -delta
}
function half_sine(inverter, real_yaw)
{
    var sine = ((Math.sin(Globals.Curtime() * 5) + 1) / 2) * 58
    var new_yaw = inverter ? real_yaw + sine : real_yaw - sine
    AntiAim.SetRealOffset(-new_yaw)
}
function half_jitter(inverter, real_yaw)
{
    var rand = Math.random() * 58
    var new_yaw = inverter ? real_yaw + rand : real_yaw - rand
    AntiAim.SetRealOffset(-new_yaw)
}
var flip = false
function switch_opposite(inverter)
{
    var fake = LBY_opposite(flip ? !inverter : inverter)
    if(fake == 180)
    {
        flip = !flip
    }
}
var flip2 = false
var last = 0
function switch_real_moving(inverter)
{
    var local = Entity.GetLocalPlayer()
    var v = Entity.GetProp(local, "CBasePlayer", "m_vecVelocity[0]")
    var len = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])
    if(len < 30)
        return
    var sim = Globals.Curtime() - Entity.GetProp(local, "CBaseEntity", "m_flSimulationTime")
    if(last > sim)
    {
        flip2 = !flip2
    }
    AntiAim.SetRealOffset(flip2 ? 58 : -58)
    last = sim
}
function jitter_real_moving(inverter)
{
    var local = Entity.GetLocalPlayer()
    var v = Entity.GetProp(local, "CBasePlayer", "m_vecVelocity[0]")
    var len = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])
    if(len < 30)
        return

    var new_yaw = Math.random() * 58 * 2 - 58
    AntiAim.SetRealOffset(new_yaw)
}
function sine_real_moving(inverter)
{
    var local = Entity.GetLocalPlayer()
    var v = Entity.GetProp(local, "CBasePlayer", "m_vecVelocity[0]")
    var len = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])
    if(len < 30)
        return
    var factor = 0
    if(len < 90)
        factor = 40
    else
        factor = 30
    var sine = Math.sin(Globals.Curtime() * 5) * factor
    AntiAim.SetRealOffset(sine)
}
function RadToDeg(a){
    return a * 180 / Math.PI
}
function calc_angle(source, entityPos){
    var delta = []
    delta[0] = source[0] - entityPos[0]
    delta[1] = source[1] - entityPos[1]
    delta[2] = source[2] - entityPos[2]
    var angles = []
    var viewangles = Local.GetViewAngles()
    angles[0] = RadToDeg(Math.atan(delta[2] / Math.hypot(delta[0], delta[1])))
    angles[1] = RadToDeg(Math.atan(delta[1] / delta[0]))
    angles[2] = 0
    if(delta[0] >= 0)
        angles[1] += 180
    while(angles[1] > 180)
        angles[1] -= 360
    while(angles[1] < -180)
        angles[1] += 360
    return angles
}
function closest_to_fov()
{
    var local = Entity.GetLocalPlayer()
    var eye = Entity.GetEyePosition(local)
    var ang = Local.GetViewAngles()
    var enemies = Entity.GetEnemies()
    var closest = -1
    var last = 180
    for(i in enemies)
    {
        if(!Entity.IsAlive(enemies[i]))
            continue
        var ang_to = calc_angle(eye, Entity.GetHitboxPosition(enemies[i], 5))
        ang_to[0] -= ang[0]
        ang_to[1] -= ang[1]
        var len = Math.sqrt(ang_to[0]*ang_to[0]+ang_to[1]*ang_to[1])
        if(len < last)
        {
            last = len
            closest = enemies[i]
        }
    }
    return closest
}
function ang_vec(a){
    var sy = Math.sin(a[1])
    var cy = Math.cos(a[1])
    var sp = Math.sin(a[0])
    var cp = Math.cos(a[0])
    return [cp*cy,cp*sy,-sp]
}
function vmf(a,b){
    return [a[0]*b,a[1]*b,a[2]*b]
}
function va(a,b){
    return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
}
var smart = false
function smart_yaw(side)
{
    var local = Entity.GetLocalPlayer()

    var ent = closest_to_fov()
    if(ent == -1)
        return
    var eye = Entity.GetEyePosition(local)
    var ang = calc_angle(eye, Entity.GetHitboxPosition(ent, 5))
    var left_ang = [0,(ang[1]+90)/180*Math.PI,0] // fucking stupid, had a bug with it and SOMEHOW this fixed it (1000 iq coder)
    var right_ang = [0,(ang[1]-90)/180*Math.PI,0] // fucking stupid, had a bug with it and SOMEHOW this fixed it (1000 iq coder)
    var normalize = function(vec)
    {
        if(vec[1] > 180)
            vec[1] -= 360
        if(vec[1] < -180)
            vec[1] += 360
        return vec
    }
    left_ang = normalize(left_ang)
    right_ang = normalize(right_ang)
    var range = UI.GetValue.apply(null, ui.smart_range)
    var left = vmf(ang_vec(left_ang), range)
    var right = vmf(ang_vec(right_ang), range)
    var temp_left = va(left, eye)
    var temp_right = va(right, eye)
    var tr_left = Trace.Line(local, eye, temp_left)
    var tr_right = Trace.Line(local, eye, temp_right)

    left = vmf(ang_vec(left_ang), range * tr_left[1])
    temp_left = va(left, eye)
    right = vmf(ang_vec(right_ang), range * tr_right[1])
    temp_right = va(right, eye)
    tr_left = Trace.Line(local, temp_left, Entity.GetHitboxPosition(ent, 5))
    tr_right = Trace.Line(local, temp_right, Entity.GetHitboxPosition(ent, 5))
    if(tr_left[0] && !tr_right[0])
        return true
    if(!tr_left[0] && tr_right[0])
        return false
    if(!tr_left[0] && !tr_right[0])
        return side
}
function autodirection()
{
    var local = Entity.GetLocalPlayer()

    var ent = closest_to_fov()
    if(ent == -1)
        return
    var eye = Entity.GetEyePosition(local)
    var ang = calc_angle(eye, Entity.GetHitboxPosition(ent, 5))
    var left_ang = [0,(ang[1]+90)/180*Math.PI,0] // fucking stupid, had a bug with it and SOMEHOW this fixed it (1000 iq coder)
    var right_ang = [0,(ang[1]-90)/180*Math.PI,0] // fucking stupid, had a bug with it and SOMEHOW this fixed it (1000 iq coder)
    var normalize = function(vec)
    {
        if(vec[1] > 180)
            vec[1] -= 360
        if(vec[1] < -180)
            vec[1] += 360
        return vec
    }
    left_ang = normalize(left_ang)
    right_ang = normalize(right_ang)
    var range = 50
    var left = vmf(ang_vec(left_ang), range)
    var right = vmf(ang_vec(right_ang), range)
    var temp_left = va(left, eye)
    var temp_right = va(right, eye)
    var tr_left = Trace.Line(local, eye, temp_left)
    var tr_right = Trace.Line(local, eye, temp_right)

    left = vmf(ang_vec(left_ang), range * tr_left[1])
    temp_left = va(left, eye)
    right = vmf(ang_vec(right_ang), range * tr_right[1])
    temp_right = va(right, eye)
    tr_left = Trace.Line(local, temp_left, Entity.GetHitboxPosition(ent, 5))
    tr_right = Trace.Line(local, temp_right, Entity.GetHitboxPosition(ent, 5))
    if(tr_left[0] && !tr_right[0])
        return 90
    if(!tr_left[0] && tr_right[0])
        return -90
    if(!tr_left[0] && !tr_right[0])
        return 0
}
function smart_lby(inverter, flipped)
{
    LBY_opposite(flipped ? smart_yaw(inverter) : !smart_yaw(inverter))
}
var enemy_brute_stage = []
function reset()
{
    enemy_brute_stage = []
}
var shots_fired = []
var last_shots_fired = []
var bullet_pos = []
var hurt = -1
var shooting = -1
function weapon_fire()
{
    if(Entity.GetEntityFromUserID(Event.GetInt("userid")) == Entity.GetLocalPlayer())
        return
    if(!shots_fired[Entity.GetEntityFromUserID(Event.GetInt("userid"))])
        shots_fired[Entity.GetEntityFromUserID(Event.GetInt("userid"))] = 0
    shots_fired[Entity.GetEntityFromUserID(Event.GetInt("userid"))]++
    shooting = Entity.GetEntityFromUserID(Event.GetInt("userid"))
}
function player_hurt()
{
    if(Entity.GetEntityFromUserID(Event.GetInt("attacker")) == Entity.GetLocalPlayer())
        return
    hurt = Entity.GetEntityFromUserID(Event.GetInt("attacker"))
}
function bullet_impact()
{
    if(Entity.GetEntityFromUserID(Event.GetInt("userid")) == Entity.GetLocalPlayer())
        return
    if(Entity.GetEntityFromUserID(Event.GetInt("userid")) == shooting)
        bullet_pos = [Event.GetFloat("x"), Event.GetFloat("y"), Event.GetFloat("z")]
}
function process_shot()
{
    if(shooting == -1)
        return
    var eye = Entity.GetEyePosition(shooting)
    var impact = bullet_pos
    var local = Entity.GetLocalPlayer()
    var head = Entity.GetHitboxPosition(local, 0)
    var ang_to_impact = calc_angle(eye, impact)
    var ang_to_local = calc_angle(eye, head)
    var delta = [ang_to_local[0]-ang_to_impact[0],ang_to_local[1]-ang_to_impact[1], 0]
    var len = Math.sqrt(delta[0]*delta[0]+delta[1]*delta[1])
    delta = [head[0]-eye[0],head[1]-eye[1],head[2]-eye[2]]
    var dist = Math.sqrt(delta[0]*delta[0]+delta[1]*delta[1]+delta[2]*delta[2])
    if(dist > 500)
        dist = 500
    dist = 500 - dist
    dist /= 450
    dist *= 20
    if(dist < 2)
        dist = 2
    if(hurt != shooting && len < dist)
    {
  
        if(!enemy_brute_stage[shooting])
            enemy_brute_stage[shooting] = 0
        enemy_brute_stage[shooting] = (enemy_brute_stage[shooting] + 1) % 3
    }
    shooting = -1
    hurt = -1
    bullet_pos = []
}
var brutee = UI.AddCheckbox("Anti-Brute")
UI.AddLabel("- Overrides Anti-Aim settings")
var autodir = UI.AddCheckbox("Autodirection")
function onCreateMove()
{
    if(UI.GetValue.apply(null, autodir))
    {
        UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", autodirection())
    }
    if(!UI.GetValue.apply(null, override))
    {
        AntiAim.SetOverride(0)
        return
    }
    AntiAim.SetOverride(1)
    var real_type = UI.GetValue.apply(null, ui.real_type)
    var lby_type = UI.GetValue.apply(null, ui.lby_type)
    var real_additional_type = UI.GetValue.apply(null, ui.real_additional_type)
    var moving_real_type = UI.GetValue.apply(null,ui.moving_real_type)
    var inverter = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter")
    var antibrute = UI.GetValue.apply(null,brutee)
    if(antibrute)
    {
        smart_lby(inverter, false)
        process_shot()
        var enemies = Entity.GetEnemies()
        var enemy_shooting = -1
        for(i in enemies)
        {
            if(!Entity.IsAlive(enemies[i]) || Entity.IsDormant(enemies[i]))
                continue
            var time = Entity.GetProp(enemies[i], "CCSPlayer", "m_nTickBase") * Globals.TickInterval()
            var next_primary_attack = Entity.GetProp(Entity.GetWeapon(enemies[i]), "CBaseCombatWeapon", "m_flNextPrimaryAttack")
            var ammo = Entity.GetProp(Entity.GetWeapon(enemies[i]), "CBaseCombatWeapon", "m_iClip1")
            var canshoot = (next_primary_attack <= time && ammo > 0)
            if(canshoot)
            {
                enemy_shooting = enemies[i]
                break
            }
        }
  
        if(enemy_shooting == -1)
            return
        if(!enemy_brute_stage[enemy_shooting])
            enemy_brute_stage[enemy_shooting] = 0
        switch(enemy_brute_stage[enemy_shooting])
        {
            case 0: AntiAim.SetRealOffset(0); break
            case 1: AntiAim.SetRealOffset(58); break
            case 2: AntiAim.SetRealOffset(-58); break
        }
        return
    }
    var real_yaw = 0

    switch(real_type)
    {
        case 0: AntiAim.SetRealOffset(inverter ? 58 : -58); real_yaw = inverter ? 58 : -58; break
        case 1: AntiAim.SetRealOffset(inverter ? -58 : 58); real_yaw = inverter ? -58 : 58; break
        case 2: AntiAim.SetRealOffset(0); break
        case 3: real_yaw = smart_middle(inverter); break
        case 4: real_yaw = follow_fake(inverter, false); break
        case 5: real_yaw = follow_fake(inverter, true); break
        case 6: AntiAim.SetRealOffset(smart_yaw(inverter) ? 58 : -58); break
        case 7: AntiAim.SetRealOffset(smart_yaw(inverter) ? -58 : 58); break
    }
    switch(lby_type)
    {
        case 0: LBY_opposite(inverter); break
        case 1: AntiAim.SetLBYOffset(0); break
        case 2: switch_opposite(inverter); break
        case 3: smart_lby(inverter, false); break
        case 4: smart_lby(inverter, true); break
    }
    switch(real_additional_type)
    {
        case 1: AntiAim.SetRealOffset(Math.sin(Globals.Curtime() * 5) * 58); break
        case 2: AntiAim.SetRealOffset(Math.random() * 58 * 2 - 58); break
        case 3: half_sine(inverter, real_yaw); break
        case 4: half_jitter(inverter, real_yaw); break
    }
    switch(moving_real_type)
    {
        case 1: switch_real_moving(inverter); break
        case 2: jitter_real_moving(inverter); break
        case 3: sine_real_moving(inverter); break
    }
}
Cheat.RegisterCallback("round_start", "reset")
Cheat.RegisterCallback("weapon_fire", "weapon_fire")
Cheat.RegisterCallback("bullet_impact", "bullet_impact")
Cheat.RegisterCallback("player_hurt", "player_hurt")
Cheat.RegisterCallback("CreateMove", "onCreateMove")
