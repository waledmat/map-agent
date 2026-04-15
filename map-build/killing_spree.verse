killing_spree := module:

    using { /Fortnite.com/Devices }
    using { /Verse.org/Native }
    using { /Verse.org/Simulation}
    using { /UnrealEngine.com/Temporary/Diagnostics }
    using { /Fortnite.com/Playspaces }
    using { /Fortnite.com/Characters }
    using { /Fortnite.com/Game }

    log_new_device:=class(log_channel){}
    KillingSpreeScript := class<concrete>(creative_device):
        Logger:log = log{Channel:=log_new_device}
        # Device List
            @editable      DebugTrigger:trigger_device = trigger_device{}
            @editable      ScoreDevice:score_manager_device = score_manager_device{}
            @editable      KillTimer:timer_device = timer_device{}
            @editable      HUD_First:hud_message_device = hud_message_device{}
            @editable      HUD_KillingSpree:[]hud_message_device = array{}

        # Options
            @editable      EnableFirstBlood:logic = true
            @editable      KillTime:float = 3.5
            @editable      KillsToStartSpree:int = 2
            @editable      ScorePerKill:int = 5
            @editable      ScoreFirstBlood:int = 10
            @editable      ScoreForSpree:int = 5

        # Variables
            var FirstBlood:logic = false
            var PlayerKillCount:[agent]int = map{}

        OnBegin<override>()<suspends>:void=
            Self.GetPlayspace().PlayerAddedEvent().Subscribe(PlayerJoin)
            SubscribeOnBeginPlayers()
            KillTimer.SuccessEvent.Subscribe(KillingSpreeFailed)
            KillTimer.SetMaxDuration(KillTime)
            DebugTrigger.TriggeredEvent.Subscribe(BeginKillingSpree)
            Logger.Print("Killing Spree Script Started!")

        SubscribeOnBeginPlayers():void =
            Players:[]player := Self.GetPlayspace().GetPlayers()
            for (PlayerNum -> P : Players ):
                PlayerJoin(P)

        PlayerJoin(Agent:agent):void=
            Print("Player Added!")
            if { set PlayerKillCount[Agent] = 0 }
            if (Chr := Agent.GetFortCharacter[]):
                Chr.EliminatedEvent().Subscribe(PlayerElimination)

        PlayerElimination(Elimination:elimination_result):void=
            Print("Elimination Event!")
            if(Instigator := Elimination.EliminatingCharacter?, InstigatorAgent := Instigator.GetInstigatorAgent[]):
                BeginKillingSpree(option {InstigatorAgent})

        GiveFirstBlood(Agent:agent):void=
            set FirstBlood = true
            HUD_First.Show( Agent )
            ScoreDevice.SetScoreAward(ScoreFirstBlood)
            ScoreDevice.Activate(Agent)
            Print("First Blood!")

        BeginKillingSpree(Agent:?agent):void=
            if (Player := Agent?):
                if ( not FirstBlood? and EnableFirstBlood?):
                    GiveFirstBlood(Player)
                if(PlayerKills := set PlayerKillCount[Player] += 1):
                    ScoreDevice.SetScoreAward(ScorePerKill)
                    ScoreDevice.Activate(Player)
                    Print("Kills: {PlayerKills}")
                    if (PlayerKills >= KillsToStartSpree and PlayerKills < ( HUD_KillingSpree.Length + 1) ):
                        for (Previous := 0 .. (PlayerKills - KillsToStartSpree - 1)):
                            if (KillSpreeMessagePrevious := HUD_KillingSpree[Previous]):
                                KillSpreeMessagePrevious.Hide()
                        if (KillSpreeMessageNext := HUD_KillingSpree[ ( PlayerKills - KillsToStartSpree ) ]):
                            KillSpreeMessageNext.Show( Player )
                        KillTimer.Reset(Player)
                        ScoreDevice.SetScoreAward(ScoreForSpree)
                        ScoreDevice.Activate(Player)
                    else if (PlayerKills >= ( HUD_KillingSpree.Length + 1) ):
                        if (KillSpreeMessagePrevious := HUD_KillingSpree[ ( HUD_KillingSpree.Length - 2 ) ]):
                            KillSpreeMessagePrevious.Hide()
                        if (KillSpreeMessageNext := HUD_KillingSpree[ ( HUD_KillingSpree.Length - 1) ]):
                            KillSpreeMessageNext.Show( Player )
                        KillTimer.Reset(Player)
                        ScoreDevice.SetScoreAward(ScoreForSpree)
                        ScoreDevice.Activate(Player)
                    Print("Successful Elimination.")
                    KillTimer.Start(Player)

        KillingSpreeFailed(Agent:?agent):void=
            if(set PlayerKillCount[Agent?] = 0):
                Logger.Print("Failed Elimination. TTK Timer Expired!")
