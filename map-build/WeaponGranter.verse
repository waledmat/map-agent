using { /Fortnite.com/Devices }
using { /Fortnite.com/Characters }
using { /Fortnite.com/Game }
using { /Verse.org/Simulation }
using { /Verse.org/Native }

pro_system_manager := class(creative_device):

    @editable PrimaryWeapon   : item_granter_device = item_granter_device{}
    @editable SecondaryWeapon : item_granter_device = item_granter_device{}

    # Add/remove spawn pads in the UEFN Details panel — no code changes needed
    @editable SpawnPads : []player_spawn_pad_device = array{}

    # Set message text in UEFN Details panel for each device
    @editable KillMessage2 : hud_message_device = hud_message_device{}  # "Level 2 Weapon!"
    @editable KillMessage4 : hud_message_device = hud_message_device{}  # "Level 3 Weapon!"
    @editable KillMessage6 : hud_message_device = hud_message_device{}  # "MAX POWER!" (HUD only — no weapon at max)

    var PlayerKills : [player]int = map{}

    OnBegin<override>()<suspends> : void =
        for (Pad : SpawnPads):
            Pad.SpawnedEvent.Subscribe(OnSpawn)
        GetPlayspace().PlayerAddedEvent().Subscribe(OnPlayerJoin)
        GetPlayspace().PlayerRemovedEvent().Subscribe(OnPlayerLeave)

    OnSpawn(Agent : agent) : void =
        PrimaryWeapon.GrantItem(Agent)
        SecondaryWeapon.GrantItem(Agent)
        # Re-subscribe EliminatedEvent to the fresh character on each respawn
        if (Player := player[Agent]):
            if (FortChar := Player.GetFortCharacter[]):
                FortChar.EliminatedEvent().Subscribe(OnKill)

    OnPlayerJoin(Player : player) : void =
        if (set PlayerKills[Player] = 0) {}

    OnPlayerLeave(Player : player) : void =
        if (set PlayerKills[Player] = 0) {}

    OnKill(Result : elimination_result) : void =
        if (EliminatingChar := Result.EliminatingCharacter?):
            if (KPlayer := EliminatingChar.GetPlayer[]):
                if (CurrentKills := PlayerKills[KPlayer]):
                    NewKills := CurrentKills + 1
                    if (set PlayerKills[KPlayer] = NewKills) {}
                    UpdateWeapon(KPlayer, NewKills)

    UpdateWeapon(Player : player, Kills : int) : void =
        if (Kills = 2):
            SecondaryWeapon.GrantItem(Player)
            KillMessage2.Show(Player)
        else if (Kills = 4):
            PrimaryWeapon.GrantItem(Player)
            KillMessage4.Show(Player)
        else if (Kills = 6):
            KillMessage6.Show(Player)
