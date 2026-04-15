using { /UnrealEngine.com/Temporary/Diagnostics }
using { /Fortnite.com/Devices }
using { /Verse.org/Simulation }

team_multiplayer_balance := class(creative_device):
    # Holds the teams found with GetTeams()
    var Teams : []team = array{}

    OnBegin<override>()<suspends> : void =
        Print("Verse Device Started!")
        set Teams = Self.GetPlayspace().GetTeamCollection().GetTeams()
        AllPlayers := GetPlayspace().GetPlayers()
        # Subscribe to PlayerAddedEvent to allow team rebalancing when a new player joins
        Self.GetPlayspace().PlayerAddedEvent().Subscribe(OnPlayerAdded)
        Print("Beginning to balance teams")
        BalanceTeams()

    OnPlayerAdded(InPlayer : player) : void =
        Print("A new Player joined, assigning them to a team!")
        BalanceTeams()

    BalanceTeams() : void =
        AllPlayers := GetPlayspace().GetPlayers()
        for (TeamPlayer : AllPlayers, CurrentTeam := GetPlayspace().GetTeamCollection().GetTeam[TeamPlayer]):
            var TeamSize:int = 0
            if(set TeamSize = GetPlayspace().GetTeamCollection().GetAgents[CurrentTeam].Length):
                Print("Size of this player's starting team is {TeamSize}")
            SmallestTeam : ?team = FindSmallestTeam(TeamSize)
            if (TeamToAssign := SmallestTeam?, GetPlayspace().GetTeamCollection().AddToTeam[TeamPlayer, TeamToAssign]):
                Print("Attempting to assign player to a new team")

    FindSmallestTeam(CurrentTeamSize : int) : ?team =
        var SmallestTeam : ?team = false
        var TeamSize : int = CurrentTeamSize
        for(Team : Teams, CandidateTeamSize := GetPlayspace().GetTeamCollection().GetAgents[Team].Length, TeamSize > CandidateTeamSize):
            set SmallestTeam = option{Team}
            set TeamSize = CandidateTeamSize
            Print("Found a team with less players: {CandidateTeamSize}")
        return SmallestTeam
