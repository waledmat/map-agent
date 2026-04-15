using { /Fortnite.com/Characters }
using { /Fortnite.com/UI }
using { /Fortnite.com/Devices }
using { /Verse.org/Simulation }
using { /Verse.org/Colors }
using { /Verse.org/Random }
using { /UnrealEngine.com/Temporary/SpatialMath }
using { /UnrealEngine.com/Temporary/Diagnostics }
using { /UnrealEngine.com/Temporary/UI }
using { /Fortnite.com/Game }

instant_spawn := class(creative_device):
    respawnposition: vector3 = vector3{X:=0.0, Y:=0.0, Z:=0.0}

    @editable
    ElimManager: elimination_manager_device = elimination_manager_device{}

    OnBegin<override>()<suspends>:void=
        Print("@GrinernCreates Script Started")
        ElimManager.EliminatedEvent.Subscribe(OnEliminated)

    OnEliminated(Agent:agent):void=
        spawn:
            RespawnEvent(Agent)

    RespawnEvent(Agent:agent)<suspends>:void=
        Sleep(0.1)
        Agent.Respawn(respawnposition, rotation{})
