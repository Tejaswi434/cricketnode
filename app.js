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
