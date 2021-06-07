function get_metric_distance(a, b)
{
    return Math.floor(Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)) * 0.0254 );
}
var local = Entity.GetLocalPlayer();
var mirage = [
    //[ "Balcony", "Stand ", 15, [-1170.448974609375,-2351.35009765625,-112.76617431640625], [-6.143388271331787,14.879289627075195,0 ], "Oneway" ],
    [ "Palace Entrance", "Fake duck + E", 15, [-32.827205657958984,-1747.707763671875,-116.18266296386719], [-13.562880516052246,-80.47711944580078,0 ], "Oneway"  ],
    [ "Palace Entrace", "Crouch + E", 25, [146.87937927246094,-2078.0126953125,9.615781784057617], [-0.2739872932434082,-108.96994018554688,0 ], "Oneway"  ],
    [ "Sniper's Nest", "Crouch + E (manual)", 40, [-886.25830078125,-1317.399658203125,-120.41223907470703], [-0.3445321321487427,-177.3930206298828,0 ], "Oneway"  ],
    [ "Cat Box", "Stand ", 10, [-691.8399658203125,-885.2897338867188,-182.1551055908203], [-1.4627931118011475,102.77088165283203,0 ], "Oneway"  ],
    [ "Connector", "Stand ", 1, [-758.4989013671875,-1321.30224609375,-108.56095123291016], [10.404932975769043,82.45069122314453,0 ], "Oneway"  ],
    [ "Cat", "Fake duck ", 10, [-1495.3671875,-1112.000732421875,-183.45028686523438], [-2.77838134765625,38.17058563232422,0 ], "Oneway"  ],
    [ "Apartments", "Fake duck ", 0, [-2336.7314453125,766.5013427734375,-79.1664810180664], [-5.943861484527588,-2.0283021926879883,0 ], "Oneway"  ],
    [ "Cat", "Fake duck ", 0, [-394.3824768066406,-796.3460693359375,-216.0263214111328], [-5.173882484436035,122.90838623046875,0 ], "Oneway"  ],
    [ "T Stairs", "Stand ", 25, [275.092529296875,316.94354248046875,-201.4618377685547], [0.7233693599700928,11.497645378112793,0 ], "Oneway"  ],
    [ "Top Mid", "Stand ", 35, [219.89126586914063,877.2789306640625,-76.8647232055664], [2.8979110717773438,-90.38306427001953,0 ], "Oneway"  ],
    [ "House Stairs / Top Mid Connector", "Fake duck ", 32, [454.9155578613281,852.4118041992188,-53.246543884277344], [16.369403839111328,-44.87099838256836,0 ], "Oneway"  ],
    [ "Underpass Stairs", "Fake duck ", 10, [-1264.1064453125,218.20901489257813,-120.45449829101563], [12.757319450378418,27.84868621826172,0 ], "Oneway"  ],
    [ "Underpass Stairs", "Stand ", 15, [-1124.922119140625,310.01190185546875,-100.71343994140625], [29.21480369567871,42.90019226074219,0 ], "Wallbang" ],
    [ "Market Entrace", "Fake duck ", 0, [-1705.237548828125,-1220.2938232421875,-207.29591369628906], [-7.482339859008789,79.5807113647461,0 ], "Oneway"],
    [ "Apartment Entrance", "Stand ", 12, [-374.2903137207031,779.552978515625,-20.803316116333008], [1.6386109590530396,-161.68849182128906,0 ], "Oneway" ],
    [ "Underpass Stairs", "Crouch ", 12, [-1101.185791015625,522.3583984375,-38.548126220703125], [80.03816223144531,-51.8855094909668,0 ], "Oneway" ],
    [ "Right Side Connector", "Stand ", 10, [-842.7730102539063,32.43463134765625,-108.64161682128906], [1.2841607332229614,-85.02303314208984,0 ], "Oneway" ],
    [ "Palace Entrance", "Fake duck ", 0, [-811.739013671875,-1145.87060546875,-72.66464233398438], [-2.2234721183776855,-50.907833099365234,0 ], "Oneway" ],
    [ "CT Stairs", "Stand ", 20, [-1495.1767578125,-1588.8564453125,-201.6099395751953], [-0.707923412322998,-79.56673431396484,0 ], "Oneway" ],
    [ "CT Spawn", "Stand ", 1, [-1722.5516357421875,-680.75244140625,-108.86699676513672], [3.074936866760254,-86.70063781738281,0 ], "Wallbang" ],
    [ "Market Entrace", "Stand (AWP)", 10, [-2231.71142578125,32.56330490112305,-108.5659408569336], [-0.22803455591201782,-47.783348083496094,0 ], "Wallbang" ], 
    [ "A Ramp", "Fake duck ", 0, [-291.80877685546875,-2112.17333984375,-53.190345764160156], [7.508554935455322,48.7481803894043,0 ], "Oneway" ],
    [ "Palace/A Ramp Connector", "Fake duck + E", 0, [1127.9307861328125,228.2334747314453,-185.51644897460938], [-1.6344425678253174,-89.02660369873047,0 ], "ESP Oneway" ],
    [ "Apartments + House", "Fake duck + E", 0, [-477.98028564453125,492.88311767578125,-99.00080871582031], [-0.6445350646972656,89.8587417602539,0 ], "Oneway" ],
    [ "Ramp", "Crouch ", 0, [780.37841796875,-1550.7978515625,-60.35479736328125], [18.644933700561523,-176.00025939941406,0 ], "Oneway" ],
    [ "House exit", "Stand", 0, [-859.4331665039063,614.7947387695313,-14.041431427001953], [2.2666337490081787,7.958107948303223,0 ], "Oneway" ],
    [ "Apartment entrance", "Stand (AWP)", 0, [-1843.001220703125,488.68048095703125,-101.81539916992188], [-2.849693775177002,3.4349939823150635,0 ], "Oneway" ],
    [ "B Van", "Fake duck ", 0, [-2259.607421875,677.5836791992188,7.429899215698242], [5.68641996383667,-71.17919158935547,0 ], "Oneway" ],
    [ "Palace", "Stand (manual shoot/ESP) ", 0, [-1506.1005859375,-990.6868896484375,-149.39236450195313], [-3.874444007873535,-38.0708122253418,0 ], "Wallbang" ],
    [ "Top Mid", "Stand", 0, [-266.930573,-366.495056,-103.172424], [1.882086,19.124743,0 ], "Oneway" ],
    [ "Balcony", "Stand ", 1, [462.96588134765625,-2084.01904296875,18.9892520904541], [1.6673067808151245,177.59693908691406,0 ], "Wallbang" ]
];

var dust2 = [ 
    [ "T Spawn", "Fake duck ", 0, [-1828.306884765625,-455.19976806640625,141.17587280273438], [-2.199988603591919,-17.8001766204834,0 ], "Oneway" ],
    [ "Tunnels", "Fake duck + E", 0, [-2071.30908203125,2895.8076171875,82.59713745117188], [0.7149654626846313,-83.99018859863281,0 ], "Oneway" ],
    [ "Tunnels Exit", "Crouch ", 0, [-776.18408203125,2555.6904296875,-25.649532318115234], [-4.512523174285889,-147.3076629638672,0 ], "Wallbang" ],
    [ "Mid/Cat", "Fake duck ", 0, [-210.51968383789063,542.5650634765625,47.2431755065918], [5.387450218200684,100.62740325927734,0 ], "Oneway" ],
    [ "Long Doors / Blue", "Fake duck ", 25, [1299.95654296875,620.3975219726563,-3.8381288051605225], [1.5557122230529785,150.635986328125,0 ], "Oneway" ],
    [ "A Site / Long", "Fake duck ", 0, [1528.8955078125,505.183837890625,-49.267723083496094], [-3.854454517364502,99.73228454589844,0 ], "Oneway" ],
    [ "A Site", "Fake duck (Long Plant)", 0, [1570.482421875,461.5287170410156,-63.220176696777344], [-5.327244758605957,99.6102294921875,0 ], "Oneway" ],
    [ "B Doors", "Crouch ", 0, [16.597061157226563,2311.9716796875,17.10267448425293], [-0.5667411088943481,-177.3401641845703,0 ], "Wallbang" ],
    [ "Long Cross / Ramp", "Fake duck ", 0, [493.2771911621094,2613.61572265625,143.1537322998047], [5.055543422698975,-37.76759338378906,0 ], "Oneway" ],
    [ "Long Doors", "Stand ", 1, [1372.70068359375,1358.381103515625,50.24076843261719], [-0.30388620495796204,-139.5752716064453,0 ], "Wallbang" ],
    [ "Long Doors Box", "Stand ", 1, [530.4532470703125,826.2880249023438,62.459720611572266], [0.7473396062850952,-50.05582046508789,0 ], "Wallbang" ],
    [ "Outside Long House", "Stand ", 10, [554.1951293945313,353.6593017578125,69.35932159423828], [2.23449444770813,-145.07130432128906,0 ], "Oneway" ],
    [ "Top Mid", "Stand ", 10, [654.1134033203125,297.8545227050781,59.560081481933594], [0.6505045294761658,-179.7573699951172,0 ], "Oneway" ],
    [ "Lower Tunnels", "Stand ", 35, [-216.03515625,1160.060791015625,89.53584289550781], [11.780013084411621,153.25389099121094,0 ], "Wallbang" ],
    [ "Cat", "Stand ", 10, [-874.2039794921875,1464.575927734375,-53.34953308105469], [-10.956621170043945,-24.002500534057617,0 ], "Oneway" ]
];

var maps = {
    "de_mirage": mirage,
    "de_dust2": dust2
};

UI.AddCheckbox("Enable WB/1W Helper");
UI.AddDropdown("Themes", ["Default", "Custom"]);
UI.AddColorPicker("Circle");
UI.AddColorPicker("Location");
UI.AddColorPicker("Extra");
UI.AddColorPicker("Distance");
UI.AddColorPicker("Line");
UI.AddColorPicker("Type");
UI.AddSliderInt("Line Length", 0,300);
UI.AddSliderInt("Render Dist.", 0,100);

function showPositions() {
      master =  UI.GetValue("Script items", "Enable WB/1W Helper");
      theme = UI.GetString("Script items", "Themes") == "Default";
      UI.SetEnabled ("Render Dist.",master);
      UI.SetEnabled ("Themes", master);
      UI.SetEnabled ("Circle",master && !theme);
      UI.SetEnabled ("Location",master && !theme);
      UI.SetEnabled ("Extra",master && !theme);
      UI.SetEnabled ("Distance",master && !theme);
      UI.SetEnabled ("Line", master && !theme);
      UI.SetEnabled ("Type",master && !theme);
      UI.SetEnabled ("Line Length", master);

      if(UI.GetString("Script items", "Themes") == "Default") {
          UI.SetColor("Script items", "Circle", [251, 2, 2, 240]);
          UI.SetColor("Script items", "Location", [249, 247, 247, 240]);
          UI.SetColor("Script items", "Extra", [249, 247, 247, 240]);
          UI.SetColor("Script items", "Distance", [249, 247, 247, 240]);
          UI.SetColor("Script items", "Line", [249, 247, 247, 240]);
          UI.SetColor("Script items", "Type", [0, 240, 85, 251]);
      }

    if(!Entity.IsAlive(local) || World.GetMapName() == "" || !UI.GetValue("Script items", "Enable WB/1W Helper"))
        return;

    color_circle = UI.GetColor("Script items","Circle");
    color_type = UI.GetColor("Script items", "Type")
    color_loc = UI.GetColor("Script items","Location");
    color_extra = UI.GetColor("Script items","Extra");
    color_distance = UI.GetColor("Script items","Distance");
    color_line = UI.GetColor("Script items", "Line");
    render_dist = UI.GetValue("Script items", "Render Dist.");
    render_line = UI.GetValue("Script items", "Line Length");
    
    map = World.GetMapName();
    oneways = maps[map];

    localPos = Entity.GetHitboxPosition(local, 5);
    
    for(oneway in oneways) {
        distance = get_metric_distance(localPos, oneways[oneway][3]);

        if(distance > render_dist)
            continue;

        world = Render.WorldToScreen(oneways[oneway][3]);

        Render.Circle(world[0], world[1], 5, color_circle);
        Render.String(world[0]+10, world[1]-24,0, oneways[oneway][5], color_type);
        Render.String(world[0]+10, world[1]-12,0, oneways[oneway][0], color_loc);
        Render.String(world[0]+10, world[1] ,0, oneways[oneway][1], color_extra);
        Render.String(world[0]+10, world[1]+12,0, Math.floor(distance)+"m", color_distance);

        eye_vec = getVec(oneways[oneway][4][0], oneways[oneway][4][1]);

        end = [oneways[oneway][3][0] + eye_vec[0] * render_line, oneways[oneway][3][1] + eye_vec[1] * render_line, oneways[oneway][3][2] + eye_vec[2] * render_line];

        world_end = Render.WorldToScreen(end);

        Render.Line(world[0], world[1], world_end[0], world_end[1], color_line);
    }
}

function getVec(pitch, yaw)
{
    var p = deg2Rad(pitch);
    var y = deg2Rad(yaw)
    var sin_p = Math.sin(p);
    var cos_p = Math.cos(p);
    var sin_y = Math.sin(y);
    var cos_y = Math.cos(y);
    return [cos_p * cos_y, cos_p * sin_y, -sin_p];
}

function deg2Rad(angle)
{
    return angle * Math.PI / 180;
}

Cheat.RegisterCallback("Draw", "showPositions");