UI.AddColorPicker("Watermark");
var color = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Watermark");

if (color[3] == 0)
	UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Watermark", [255, 0, 0, 255]);

function draw() {
	if(!World.GetServerString())
		return;

	var today = new Date();
    var hours1 = today.getHours();
    var minutes1 = today.getMinutes();
	var seconds1 = today.getSeconds();
	
    var hours = hours1 <= 9 ? "0"+hours1+":" : hours1+":";
    var minutes = minutes1 <= 9 ? "0" + minutes1+":" : minutes1+":";
	var seconds = seconds1 <= 9 ? "0" + seconds1 : seconds1;
	
	var server_tickrate = Globals.Tickrate().toString()
	var ebanaya_hueta = Math.round(Entity.GetProp(Entity.GetLocalPlayer(), "CPlayerResource", "m_iPing")).toString()

	color = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Watermark");

	var font = Render.AddFont("Verdana", 7, 400);
	var text = "HanahiraSense V5  | " + "Beta Version" + " | Delay: " + ebanaya_hueta + "ms | " + server_tickrate + "tick | " + hours + minutes + seconds;
	
	var w = Render.TextSizeCustom(text, font)[0] + 8;
	var x = Global.GetScreenSize()[0];

	x = x - w - 10;

	Render.FilledRect(x, 10, w, 2, [ color[0], color[1], color[2], 255 ]);
	Render.FilledRect(x, 12, w, 18, [ 17, 17, 17, color[3] ]);
	Render.StringCustom(x+4, 10 + 4, 0, text, [ 255, 255, 255, 255 ], font);
}

Cheat.RegisterCallback("Draw", "draw");