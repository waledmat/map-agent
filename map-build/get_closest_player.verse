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

get_closest_player := class(creative_device):

    OnBegin<override>()<suspends>:void=
        Print("@GrinernCreates Script Started")

    GetClosestPlayerToViewpoint(AllPlayers: []player, Viewpoint:vector3, InitialCharacter: fort_character): fort_character =
        var ClosestCharacter : fort_character = InitialCharacter
        var ClosestDistance: float = 1000000000.0
        for (Player : AllPlayers):
            if (FNCharacter : fort_character = Player.GetFortCharacter[]):
                if (FNCharacter <> InitialCharacter):
                    PlayerLocation := FNCharacter.GetTransform().Translation
                    EDistance := Distance(Viewpoint, PlayerLocation)
                    if (EDistance < ClosestDistance):
                        set ClosestCharacter = FNCharacter
                        set ClosestDistance = EDistance
        return ClosestCharacter
