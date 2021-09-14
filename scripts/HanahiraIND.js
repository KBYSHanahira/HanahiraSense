// UI Widgets //
UI.AddLabel("=======INDICATORS V2=======");
UI.AddSliderInt("Circle Radius", 10, 50);
UI.AddSliderInt("Arc Length", 0, 90);
UI.AddSliderInt("Arc Thickness", 0, 20);
UI.AddSliderInt("Arc Precision (Use less for more fps)", 20, 500);
UI.AddCheckbox("Reset Indicator Colors");
UI.AddColorPicker("Circle Color");
UI.AddColorPicker("Real Color");
UI.AddColorPicker("Fake Color");
UI.AddLabel("========================");

// Default values //
UI.SetValue("Misc", "JAVASCRIPT", "Script items", "Circle Radius", 30);
UI.SetValue("Misc", "JAVASCRIPT", "Script items", "Arc Length", 45);
UI.SetValue("Misc", "JAVASCRIPT", "Script items", "Arc Thickness", 5);
UI.SetValue("Misc", "JAVASCRIPT", "Script items", "Arc Precision (Use less for more fps)", 280);
UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Circle Color", [120, 120, 120, 192]);
UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Real Color", [255, 0, 196, 255]);
UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Fake Color", [170, 128, 255, 255]);

// Settings //
var circle_radius       = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Circle Radius");
var arc_length          = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Arc Length");
var arc_thickness       = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Arc Thickness");
var arc_precision       = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Arc Precision (Use less for more fps)");
var circle_color        = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Circle Color");
var real_color          = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Real Color");
var fake_color          = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Fake Color");


function update_settings()
{
    circle_radius       = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Circle Radius");
    arc_length          = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Arc Length");
    arc_thickness       = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Arc Thickness");
    arc_precision       = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Arc Precision (Use less for more fps)");
    circle_color        = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Circle Color");
    real_color          = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Real Color");
    fake_color          = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Fake Color");


    if(arc_thickness > circle_radius)
        UI.SetValue("Misc", "JAVASCRIPT", "Script items", "Arc Thickness", circle_radius);

    if(UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Reset Indicator Colors"))
    {
        UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Circle Color", [255, 0, 0, 190]);
        UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Real Color", [255, 0, 196, 255]);
        UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Fake Color", [170, 128, 255, 255]);
        UI.SetValue("Misc", "JAVASCRIPT", "Script items", "Reset Indicator Colors", false)
    }
   
}

function draw_circle(x, y, radius, thickness, color)
{
    var inner = radius - thickness;

    for(; radius > inner; --radius)
    {
        Render.Circle(x, y, radius, color);
    }
}

function draw_arc(x, y, radius, start_angle, percent, thickness, color)
{
    var precision   = (2 * Math.PI) / arc_precision;
    var step        = Math.PI / 180;
    var inner       = radius - thickness;
    var end_angle   = (start_angle + percent) * step;
    var start_angle = (start_angle * Math.PI) / 180;

    for(; radius > inner; --radius)
    {
        for(var angle = start_angle; angle < end_angle; angle += precision)
        {
            var cx = Math.round(x + radius * Math.cos(angle));
            var cy = Math.round(y + radius * Math.sin(angle));

            var cx2 = Math.round(x + radius * Math.cos(angle + precision));
            var cy2 = Math.round(y + radius * Math.sin(angle + precision));

            Render.Line(cx, cy, cx2, cy2, color);
        }
    }
}

function adjust_angle(angle)
{
    if(angle < 0)
    {
        angle = (90 + angle * (-1));
    }
    else if(angle > 0)
    {
        angle = (90 - angle);
    }

    return angle;
}

function main()
{
    var local_player = Entity.GetLocalPlayer();

    if(!Entity.IsAlive(local_player))
        return;

    update_settings();

    var screen_size     = Render.GetScreenSize();
    var screen_middle_x = screen_size[0] * 0.5;
    var screen_middle_y = screen_size[1] * 0.5;

    var view_angles = Local.GetViewAngles();

    var real_yaw = Local.GetRealYaw();
    var fake_yaw = Local.GetFakeYaw();
    var view_yaw = view_angles[1] - 180;
 
    var real = adjust_angle(real_yaw - view_yaw);
    var fake = adjust_angle(fake_yaw - view_yaw);

    draw_circle(screen_middle_x, screen_middle_y, circle_radius, arc_thickness, circle_color);
    draw_arc(screen_middle_x, screen_middle_y, circle_radius, fake - (arc_length * 0.5), arc_length, arc_thickness, fake_color);
    draw_arc(screen_middle_x, screen_middle_y, circle_radius, real - (arc_length * 0.5), arc_length, arc_thickness, real_color);

    var double_tap_color = UI.IsHotkeyActive( "Rage", "GENERAL", "Exploits", "Doubletap" ) ? real_color : circle_color;
    var hide_shots_color = UI.IsHotkeyActive( "Rage", "GENERAL", "Exploits", "Hide shots" ) ? real_color : circle_color;
    var safe_point_color = UI.IsHotkeyActive( "Rage", "GENERAL", "General", "Force safe point" ) ? real_color : circle_color;

    var text_offset = screen_middle_y + circle_radius;
    var text_spacing = screen_size[1] * 0.0185185185;

    Render.String(screen_middle_x, text_offset + text_spacing, 1, "ON-SHOT", hide_shots_color);
    Render.String(screen_middle_x, text_offset + (text_spacing * 2), 1, "FAST TAP", double_tap_color);
    Render.String(screen_middle_x, text_offset + (text_spacing * 3), 1, "SAFE POINT", safe_point_color);
}

Cheat.RegisterCallback("Draw", "main");