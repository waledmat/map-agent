using { /Fortnite.com/Devices }
using { /Fortnite.com/Characters }
using { /Fortnite.com/Game }
using { /Verse.org/Simulation }
using { /Verse.org/Native }
using { /UnrealEngine.com/Temporary/Diagnostics }

# ============================================================
#  Quantum Circuit: Neon Blitz — Main Map Logic
#  Paste this file into your UEFN Verse module.
#  Then wire up the @editable devices in the UEFN Details panel.
# ============================================================

quantum_circuit_manager := class(creative_device):

    # ── Reconfig Wall Triggers (add all Moving Wall Devices here) ──
    @editable Wall1 : trigger_device = trigger_device{}
    @editable Wall2 : trigger_device = trigger_device{}
    @editable Wall3 : trigger_device = trigger_device{}
    @editable Wall4 : trigger_device = trigger_device{}

    # ── Rail Triggers (add all Moving Rail Devices here) ──
    @editable Rail1 : trigger_device = trigger_device{}
    @editable Rail2 : trigger_device = trigger_device{}
    @editable Rail3 : trigger_device = trigger_device{}

    # ── Timer Devices ──
    @editable ReconfigTimer : timer_device = timer_device{}    # Set to 90s loop
    @editable GlitchTimer   : timer_device = timer_device{}   # Set to 150s loop

    # ── Glitch Storm Devices ──
    @editable GlitchAudio        : audio_player_device  = audio_player_device{}
    @editable HiddenLoot1        : item_spawner_device  = item_spawner_device{}
    @editable HiddenLoot2        : item_spawner_device  = item_spawner_device{}
    @editable HiddenLoot3        : item_spawner_device  = item_spawner_device{}
    @editable HiddenLoot4        : item_spawner_device  = item_spawner_device{}

    # ── Neon Core Zone (place a mutator_zone around each core) ──
    @editable CoreZone1 : mutator_zone_device = mutator_zone_device{}
    @editable CoreZone2 : mutator_zone_device = mutator_zone_device{}

    # ── UI / HUD Notifications ──
    @editable ReconfigNotify : hud_message_device = hud_message_device{}
    @editable GlitchNotify   : hud_message_device = hud_message_device{}
    @editable CoreNotify     : hud_message_device = hud_message_device{}

    # Internal state
    var ReconfigPhase : int = 0
    var GlitchActive  : logic = false

    # ──────────────────────────────────────────────────────────
    OnBegin<override>()<suspends> : void =

        # Subscribe to timer events
        ReconfigTimer.SuccessEvent.Subscribe(OnReconfigTick)
        GlitchTimer.SuccessEvent.Subscribe(OnGlitchTick)

        # Subscribe to core pickup zones
        CoreZone1.AgentEntersEvent.Subscribe(OnCorePickup)
        CoreZone2.AgentEntersEvent.Subscribe(OnCorePickup)

        # Start timers
        ReconfigTimer.Start()
        GlitchTimer.Start()

    # ──────────────────────────────────────────────────────────
    #  DYNAMIC CIRCUIT RECONFIGURATION  (every 90 seconds)
    # ──────────────────────────────────────────────────────────
    OnReconfigTick(ignored : agent) : void =
        set ReconfigPhase = Mod[ReconfigPhase + 1, 3]
        ReconfigNotify.Show()

        if (ReconfigPhase = 0):
            # Phase 0 — open walls 1 & 2, close 3 & 4
            Wall1.Trigger()
            Wall2.Trigger()
            Rail1.Trigger()
        else if (ReconfigPhase = 1):
            # Phase 1 — open walls 3 & 4, close 1 & 2
            Wall3.Trigger()
            Wall4.Trigger()
            Rail2.Trigger()
        else:
            # Phase 2 — all rails active, walls half-open
            Rail3.Trigger()
            Wall1.Trigger()
            Wall3.Trigger()

    # ──────────────────────────────────────────────────────────
    #  GLITCH STORM  (every 150 seconds, lasts 15 seconds)
    # ──────────────────────────────────────────────────────────
    OnGlitchTick(ignored : agent) : void =
        if (not GlitchActive):
            spawn { RunGlitchStorm() }

    RunGlitchStorm()<suspends> : void =
        set GlitchActive = true

        # Show UI, play audio, spawn hidden loot
        GlitchNotify.Show()
        GlitchAudio.Play()
        HiddenLoot1.SpawnItem()
        HiddenLoot2.SpawnItem()
        HiddenLoot3.SpawnItem()
        HiddenLoot4.SpawnItem()

        # Storm lasts 15 seconds
        Sleep(15.0)

        GlitchAudio.Stop()
        set GlitchActive = false

    # ──────────────────────────────────────────────────────────
    #  NEON CORE BUFF  (10 second damage boost on pickup)
    # ──────────────────────────────────────────────────────────
    OnCorePickup(Agent : agent) : void =
        spawn { ApplyCoreBuff(Agent) }

    ApplyCoreBuff(Agent : agent)<suspends> : void =
        CoreNotify.Show()
        # Buff active for 10 seconds
        Sleep(10.0)
        # Buff expires — no action needed, device handles removal
