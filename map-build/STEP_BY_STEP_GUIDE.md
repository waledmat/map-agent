# Quantum Circuit: Neon Blitz — Beginner Build Guide
# No experience needed. Follow every step in order.

---

## BEFORE YOU START
- UEFN must be installed and updated
- You need a free Epic Games account
- Set aside 2-3 hours for the first session

---

## STEP 1 — Create a New Project

1. Open **Unreal Editor for Fortnite** from Epic Games Launcher
2. Click **"Create Project"**
3. Choose template: **"Deathmatch"** (closest to our map type)
4. Name it: `QuantumCircuitNeonBlitz`
5. Click **Create**
6. Wait for it to load (can take 2-5 minutes first time)

---

## STEP 2 — Set Up the Island

1. In the top menu click **"Island Settings"**
2. Set these values:
   - Game Mode: **Team Deathmatch**
   - Teams: **2**
   - Max Players: **16**
   - Respawn Time: **3 seconds**
   - Round Time: **10 minutes**
3. Click **Apply**

---

## STEP 3 — Build the 5 Zones
*(Use the gallery on the left to find props and floors)*

### Zone 1 — Spawn Island
1. Pick a flat area on the map
2. Place a large **floor prop** (search "floor" in the Content Browser)
3. Add **neon light strips** along the edges (search "neon" or "light strip")
4. This is where players start — keep it open and simple

### Zone 2 — Core Hall (Main Arena)
1. Create a large rectangle shape using **wall props**
2. Add a **ceiling** using ceiling props
3. Place **2 vertical lifts** on opposite walls:
   - Search for **"Vertical Lift Device"** in the Device panel
   - Place one on the left wall, one on the right wall
4. Add **3 zip-line/rail props** snaking through the hall
5. Add **neon light strips** along the rails — blue and pink colors

### Zone 3 — Vertical Tower
1. Build a tall tower structure in one corner
2. Create **3 platforms** at different heights (use floor props stacked)
3. Add **ramps or ladders** between platforms
4. Place sniper spots at the top

### Zone 4 — Dynamic Reconfiguration Zone
1. Build a grid of rooms using wall props
2. Leave space between wall sections (these will "move" in game)
3. Add moving wall devices (see Step 5)

### Zone 5 — Glitch Storm Chamber
1. Build a circular open area in the CENTER of the map
2. Use **glowing floor props** (search "neon grid")
3. This is where the Glitch Storm event happens

---

## STEP 4 — Place All Devices
*(Devices panel is on the left side — search for each one)*

### Player Spawns
1. Search: **"Player Spawn Pad"**
2. Place **8 spawn pads** in Zone 1 (Spawn Island)
3. Settings for each: Team = Any, Respawn Delay = 3s

### Weapons (use Item Granter — easier than Weapon Spawner)
Instead of floor weapon spawners, use the **WeaponGranter** Verse script to give weapons directly on spawn:

1. Search: **"Item Granter"** in Content Browser
2. Place **2 Item Granter** devices anywhere in the scene
3. Click Item Granter #1 → Details panel → set **Item = Pulse Rifle** (or SMG)
4. Click Item Granter #2 → Details panel → set **Item = Shotgun**
5. The WeaponGranter Verse script (Step 5b) connects these to spawn pads automatically

> If you still want floor weapons too: search **"Item Spawner"**, place a few, set Item = any weapon, Respawn Time = 30s

### Neon Core Pickups
1. Search: **"Item Spawner"**
2. Place **6 Item Spawners** along the rails in Core Hall
3. Settings: Respawn Timer = 20s, Item = any pickup item (use health orb as placeholder)

### Timers (2 needed)
1. Search: **"Timer Device"**
2. Place **Timer 1** (Reconfig Timer):
   - Duration: **90 seconds**
   - Loop: **On**
   - Name it "ReconfigTimer" in the Details panel
3. Place **Timer 2** (Glitch Storm Timer):
   - Duration: **150 seconds**
   - Loop: **On**
   - Name it "GlitchTimer"

### Triggers for Moving Walls (7 needed)
1. Search: **"Trigger Device"**
2. Place **4 triggers** in Zone 4 (one per wall section) — name them Wall1, Wall2, Wall3, Wall4
3. Place **3 triggers** along rails — name them Rail1, Rail2, Rail3

### Mutator Zones (Neon Core Buffs)
1. Search: **"Mutator Zone"**
2. Place **2 Mutator Zones** around core pickup spots in Core Hall
3. Settings:
   - Buff Type: Damage Boost
   - Buff Amount: 1.25x
   - Only Affect Players Inside: ON

### Hidden Loot (Glitch Storm)
1. Search: **"Item Spawner"**
2. Place **4 Item Spawners** in Zone 5 (Glitch Storm Chamber)
3. Settings: Start Enabled = OFF (the Verse script turns them on)
4. Name them HiddenLoot1, HiddenLoot2, HiddenLoot3, HiddenLoot4

### Audio
1. Search: **"Audio Player Device"**
2. Place **1 Audio Player** in Zone 5
3. Name it "GlitchAudio"
4. Choose a glitchy/electric sound from the sound library

### HUD Messages (3 needed)
1. Search: **"HUD Message Device"**
2. Place 3 HUD Message devices anywhere (they're invisible in game)
3. Set messages:
   - ReconfigNotify: "CIRCUIT RECONFIGURING!"
   - GlitchNotify: "GLITCH STORM INCOMING!"
   - CoreNotify: "NEON CORE — DAMAGE BOOST x1.25 for 10s"

---

## STEP 5 — Add the Verse Script

1. In the top menu click **"Verse"** → **"Open Verse Explorer"**
2. Right-click your project → **"Add new Verse file"**
3. Name it: `MapLogic`
4. Delete all the default text in the file
5. Open the file: `map-build/MapLogic.verse` (in your project folder on Desktop)
6. **Copy all the text** from MapLogic.verse
7. **Paste** it into UEFN's Verse editor
8. Click **"Compile Verse"** (top toolbar) — wait for green checkmark

---

## STEP 5b — Add the WeaponGranter Script

1. In Verse Explorer → right-click → **Add new Verse file** → name it `WeaponGranter`
2. Open `map-build/WeaponGranter.verse` in Notepad → **Ctrl+A** → **Ctrl+C**
3. Paste into UEFN Verse editor → **Ctrl+S** → **Compile Verse**
4. Drag **"weapon_granter_manager"** device from Content Browser into the scene
5. Click it → wire in Details panel:
   - **PrimaryWeapon** → Item Granter #1 (Pulse Rifle)
   - **SecondaryWeapon** → Item Granter #2 (Shotgun)
   - **SpawnPad1–8** → each of your 8 Player Spawn Pads

---

## STEP 6 — Wire Up the Verse Script to Devices

1. Find the **"quantum_circuit_manager"** device in your scene (it appears after compiling)
2. Click it to select it
3. In the **Details panel** on the right, you'll see all the @editable slots
4. Drag and drop each device into its slot:
   - Wall1 → the trigger device named Wall1
   - Wall2 → Wall2 trigger
   - Wall3 → Wall3 trigger
   - Wall4 → Wall4 trigger
   - Rail1 → Rail1 trigger
   - Rail2 → Rail2 trigger
   - Rail3 → Rail3 trigger
   - ReconfigTimer → your 90s timer device
   - GlitchTimer → your 150s timer device
   - GlitchAudio → your audio player device
   - HiddenLoot1-4 → your 4 hidden item spawners
   - CoreZone1-2 → your 2 mutator zone devices
   - ReconfigNotify/GlitchNotify/CoreNotify → your 3 HUD message devices

---

## STEP 7 — Test the Map

1. Click the **Play** button (green triangle) at the top
2. Test checklist:
   - [ ] Players spawn correctly
   - [ ] Weapons appear at spawn spots
   - [ ] Vertical lifts work (ride them up and down)
   - [ ] Wait 90 seconds — do walls/rails trigger?
   - [ ] Wait 150 seconds — does Glitch Storm start? (audio plays, loot appears)
   - [ ] Walk into a Mutator Zone — do you get a buff icon?
3. Press **Escape** to stop the test

---

## STEP 8 — Publish the Map

1. Top menu → **"Map Settings"**
2. Fill in:
   - Name: Quantum Circuit: Neon Blitz
   - Description: A cyberpunk Team Deathmatch map with dynamic arenas that change every 90 seconds. Zip-lines, magnetic rails, and Glitch Storm events keep every match fresh.
   - Thumbnail: take a screenshot of your map in the editor
3. Click **"Validate"** — fix any errors shown
4. Click **"Publish to Fortnite"**
5. Wait for Epic Games review (usually 24-48 hours)
6. Once approved you get an **Island Code** — share it!

---

## TIPS FOR BEGINNERS

- **Save often** — Ctrl+S every 10 minutes
- **Undo** is Ctrl+Z if you place something wrong
- **Middle mouse button** to pan the camera
- **Right click + drag** to rotate camera
- **F key** to focus on a selected object
- If Verse compile fails — check that you copied the FULL file with no missing lines
- Start with just Zone 1 and Zone 2 and test before building all 5 zones
