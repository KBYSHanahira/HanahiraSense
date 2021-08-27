var original_aa = true;

UI.AddHotkey("Legit AA+Down Key");

function legit_aa()
{
    if (UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script items", "Legit AA+Down Key"))
    {
        if (original_aa)
        {
            restrictions_cache = UI.GetValue("Misc", "PERFORMANCE & INFORMATION", "Information", "Restrictions");
            hiderealangle_cache = UI.GetValue ("Anti-Aim", "Fake angles", "Hide real angle");
            yaw_offset_cache = UI.GetValue ("Anti-Aim", "Rage Anti-Aim", "Yaw offset");
            jitter_offset_cache = UI.GetValue ("Anti-Aim", "Rage Anti-Aim", "Jitter offset");
            pitch_cache = UI.GetValue ("Anti-Aim", "Extra", "Pitch");
            original_aa = false;
        }
        UI.SetValue ("Misc", "PERFORMANCE & INFORMATION", "Information", "Restrictions", 0);
        UI.SetValue ("Anti-Aim", "Fake angles", "Hide real angle", true);
        UI.SetValue ("Anti-Aim", "Rage Anti-Aim", "Yaw offset", 180);
        UI.SetValue ("Anti-Aim", "Rage Anti-Aim", "Jitter offset", 0);
        UI.SetValue ("Anti-Aim", "Extra", "Pitch", 0); // 0 değeri idi
    }
    else
    {
        if (!original_aa)
        {
            UI.SetValue ("Misc", "PERFORMANCE & INFORMATION", "Information", "Restrictions", restrictions_cache);
            UI.SetValue ("Anti-Aim", "Fake angles", "Hide real angle", hiderealangle_cache);
            UI.SetValue ("Anti-Aim", "Rage Anti-Aim", "Yaw offset", yaw_offset_cache);
            UI.SetValue ("Anti-Aim", "Rage Anti-Aim", "Jitter offset", jitter_offset_cache);
            UI.SetValue ("Anti-Aim", "Extra", "Pitch", pitch_cache);
            original_aa = true;
        }
    }
}

Cheat.RegisterCallback("CreateMove", "legit_aa");