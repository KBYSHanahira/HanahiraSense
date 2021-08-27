UI.AddDropdown( "Custom ClanTag", [ "Disabled", "NR by clonn3x"] );
UI.AddSliderInt( "Custom ClanTag Speed", 1, 10 );
var lasttime = 0;
function onRender( )
{
    var tag = UI.GetValue( "Script Items", "Custom ClanTag" );
    var speed = UI.GetValue( "Script Items", "Custom ClanTag Speed" );
    var time = parseInt((Globals.Curtime() * speed))
    if (time != lasttime)
    {
        if(tag == 0) { Local.SetClanTag(""); }
        if(tag == 1)
            {
            switch((time) % 56)
            {
            case 1: { Local.SetClanTag(" "); break; }
            case 2: { Local.SetClanTag(" |"); break; }
            case 3: { Local.SetClanTag(" "); break; }
            case 4: { Local.SetClanTag("N "); break; }
            case 5: { Local.SetClanTag("N "); break; }
            case 6: { Local.SetClanTag("N3 "); break; }
            case 7: { Local.SetClanTag("Ne "); break; }
            case 8: { Local.SetClanTag("Ne\ "); break; }
            case 9: { Local.SetClanTag("Ne\/ "); break; }
            case 10: { Local.SetClanTag("Nev "); break; }
            case 11: { Local.SetClanTag("Nev3 "); break; }
            case 12: { Local.SetClanTag("Neve "); break; }
            case 13: { Local.SetClanTag("Neve| "); break; }
            case 14: { Local.SetClanTag("Neve|2 "); break; }
            case 15: { Local.SetClanTag("Never| "); break; }
            case 16: { Local.SetClanTag("Never|_ "); break; }
            case 17: { Local.SetClanTag("Neverl "); break; }
            case 18: { Local.SetClanTag("Neverl0 "); break; }
            case 19: { Local.SetClanTag("Neverlo "); break; }
            case 20: { Local.SetClanTag("Neverlo5 "); break; }
            case 21: { Local.SetClanTag("Neverlos "); break; }
            case 22: { Local.SetClanTag("Neverlos3 "); break; }
            case 23: { Local.SetClanTag("Neverlose "); break; }
            case 24: { Local.SetClanTag("Neverlose. "); break; }
            case 25: { Local.SetClanTag("Neverlose.< "); break; }
            case 26: { Local.SetClanTag("Neverlose.c< "); break; }
            case 27: { Local.SetClanTag("Neverlose.cc "); break; }
            case 28: { Local.SetClanTag("Neverlose.cc "); break; }
            case 29: { Local.SetClanTag("Neverlose.c< "); break; }
            case 30: { Local.SetClanTag("Neverlose.< "); break; }
            case 31: { Local.SetClanTag("Neverlose. "); break; }
            case 32: { Local.SetClanTag("Neverlose "); break; }
            case 33: { Local.SetClanTag("Neverlos3 "); break; }
            case 34: { Local.SetClanTag("Neverlos "); break; }
            case 35: { Local.SetClanTag("Neverlo_ "); break; }
            case 36: { Local.SetClanTag("Neverlo5 "); break; }
            case 37: { Local.SetClanTag("Neverlo "); break; }
            case 38: { Local.SetClanTag("Neverl_ "); break; }
            case 39: { Local.SetClanTag("Never|0 "); break; }
            case 40: { Local.SetClanTag("Never| "); break; }
            case 41: { Local.SetClanTag("Neve|2 "); break; }
            case 42: { Local.SetClanTag("Neve| "); break; }
            case 43: { Local.SetClanTag("Neve "); break; }
            case 44: { Local.SetClanTag("Nev3 "); break; }
            case 45: { Local.SetClanTag("Nev "); break; }
            case 46: { Local.SetClanTag("Ne\/ "); break; }
            case 47: { Local.SetClanTag("Ne\ "); break; }
            case 48: { Local.SetClanTag("Ne "); break; }
            case 49: { Local.SetClanTag("N3 "); break; }
            case 50: { Local.SetClanTag("N "); break; }
            case 51: { Local.SetClanTag("|\| "); break; }
            case 52: { Local.SetClanTag(" "); break; }
            case 53: { Local.SetClanTag(" |"); break; }
            case 54: { Local.SetClanTag(" "); break; }
            case 55: { Local.SetClanTag(" "); break; }
            case 56: { Local.SetClanTag(" "); break; }
            }
        }
    }
    lasttime = time;
}
Cheat.RegisterCallback("Draw", "onRender");