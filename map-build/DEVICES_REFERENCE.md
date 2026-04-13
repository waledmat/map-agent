# Device Quick Reference — Quantum Circuit: Neon Blitz

## FULL DEVICE LIST (everything you need to place)

| Device Name | Search For In UEFN | Count | Key Settings |
|---|---|---|---|
| Player Spawn Pad | "Player Spawn Pad" | 8 | Team=Any, Respawn=3s |
| Weapon Spawner (Pulse Rifle) | "Weapon Spawner" | 4 | Respawn=30s |
| Weapon Spawner (SMG) | "Weapon Spawner" | 7 | Respawn=20s |
| Weapon Spawner (Shotgun) | "Weapon Spawner" | 6 | Respawn=25s |
| Weapon Spawner (Sniper) | "Weapon Spawner" | 4 | Respawn=45s |
| Weapon Spawner (Grenade) | "Weapon Spawner" | 5 | Respawn=30s |
| Item Spawner (Neon Core) | "Item Spawner" | 6 | Respawn=20s, StartEnabled=ON |
| Item Spawner (Hidden Loot) | "Item Spawner" | 4 | StartEnabled=OFF |
| Vertical Lift | "Vertical Lift" | 2 | Height=600, Speed=800 |
| Timer Device (Reconfig) | "Timer Device" | 1 | Duration=90s, Loop=ON |
| Timer Device (Glitch) | "Timer Device" | 1 | Duration=150s, Loop=ON |
| Trigger Device (Walls) | "Trigger Device" | 4 | Named Wall1-Wall4 |
| Trigger Device (Rails) | "Trigger Device" | 3 | Named Rail1-Rail3 |
| Mutator Zone (Core Buff) | "Mutator Zone" | 2 | DamageBoost=1.25x, OnlyInside=ON |
| Audio Player | "Audio Player Device" | 1 | Named GlitchAudio |
| HUD Message (Reconfig) | "HUD Message Device" | 1 | Text="CIRCUIT RECONFIGURING!" |
| HUD Message (Glitch) | "HUD Message Device" | 1 | Text="GLITCH STORM INCOMING!" |
| HUD Message (Core) | "HUD Message Device" | 1 | Text="NEON CORE — DAMAGE BOOST x1.25 for 10s" |

**TOTAL DEVICES: ~55**

---

## ZONE MAP

```
+------------------+------------------+
|                  |                  |
|   SPAWN ISLAND   |  VERTICAL TOWER  |
|   (Zone 1)       |  (Zone 3)        |
|                  |                  |
+------------------+--------+---------+
|                           |         |
|       CORE HALL           | GLITCH  |
|       (Zone 2)            | STORM   |
|   [rails & lifts here]    | CHAMBER |
|                           | (Zone 5)|
+------------------+--------+---------+
|                  |
| DYNAMIC RECONFIG |
|    (Zone 4)      |
|                  |
+------------------+
```

---

## VERSE SCRIPT — DEVICE WIRING TABLE

After you compile MapLogic.verse, wire these up in the Details panel:

| Script Variable | Connect To |
|---|---|
| Wall1 | Trigger Device named "Wall1" |
| Wall2 | Trigger Device named "Wall2" |
| Wall3 | Trigger Device named "Wall3" |
| Wall4 | Trigger Device named "Wall4" |
| Rail1 | Trigger Device named "Rail1" |
| Rail2 | Trigger Device named "Rail2" |
| Rail3 | Trigger Device named "Rail3" |
| ReconfigTimer | Timer Device (90s) |
| GlitchTimer | Timer Device (150s) |
| GlitchAudio | Audio Player Device |
| HiddenLoot1 | Item Spawner (hidden) #1 |
| HiddenLoot2 | Item Spawner (hidden) #2 |
| HiddenLoot3 | Item Spawner (hidden) #3 |
| HiddenLoot4 | Item Spawner (hidden) #4 |
| CoreZone1 | Mutator Zone #1 |
| CoreZone2 | Mutator Zone #2 |
| ReconfigNotify | HUD Message "CIRCUIT RECONFIGURING!" |
| GlitchNotify | HUD Message "GLITCH STORM INCOMING!" |
| CoreNotify | HUD Message "NEON CORE..." |

---

## COLOR SCHEME (for props and lights)

- Primary: Electric Blue (#00BFFF)
- Accent: Hot Pink (#FF1493)
- Secondary: Acid Green (#39FF14)
- Background: Dark Navy (#0a0a1a)
- Chrome: Silver (#C0C0C0)

Use these colors in light strip and material settings.
