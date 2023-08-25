const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
const conversion = (each) => {
  return {
    playerId: each.player_id,
    playerName: each.player_name,
    jerseyNumber: each.jersey_number,
    role: each.role,
  };
};
app.get("/players/", async (request, response) => {
  const all_players = `select * from cricket_team
    order by player_id;`;
  const player = await db.all(all_players);
  console.log(player);
  response.send(player.map((each) => conversion(each)));
});
/*posting method*/
app.post("/players/", async (request, response) => {
  const p = request.body;
  console.log(p);
  const { playerName, jerseyNumber, role } = p;
  const databaseadding = `INSERT INTO cricket_team(player_name,jersey_number,role) 
    values('${playerName}','${jerseyNumber}','${role}');`;
  const change = await db.run(databaseadding);
  console.log(change);
  response.send("Player Added to Team");
});
/*updating particular*/
app.put("/players/:playerId/", async (request, response) => {
  const { player_Id } = request.params;
  const playerdetails = request.body;
  const { p, j, r } = playerdetails;
  const dbtaking = `update cricket_team 
    set 
    player_name='${p}'
    jersey_number='${j}'
    role='${r}'
    where player_id='${player_Id}';`;
  await db.run(dbtaking);
  response.send("Player Details Updated");
});
