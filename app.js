const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const sequelize = require("./database/db");
const Player = require("./models/Player");
const Game = require("./models/Game");
app.use(express.json());
app.get("/", (req, res) => {
	const date = Date.now();
	Player.create({}).then(user => {
		res.json(user);
	});
});

app.get("/players", async (req, res) => {
	const players = await Player.findAll();
	res.json(players);
});
app.get("/players/:id", async (req, res) => {
	const player = await Player.findOne({ id: req.params.id });
	res.json(player);
});
app.get("/a/players/:id", (req, res) => {
	const a = Math.floor(Math.random() * 7) + 1;
	const b = Math.floor(Math.random() * 7) + 1;
	const result = a + b;
	Game.create({ id: req.params.id, dice1: a, dice2: b });
});
app.get("/players/update/:id", async (req, res) => {
	const player = await Player.findOne({ where: { id: req.params.id } });
	await player.update({ username: "Sa" }, { where: { id: req.params.id } });
});
const a = Math.floor(Math.random() * 7) + 1;
const b = Math.floor(Math.random() * 7) + 1;
const result = a + b;
console.log(result);
app.listen(PORT, () => {
	console.log(` App runing on port http://localhost:${PORT}`);
	Player.hasMany(Game);
	Game.belongsTo(Player);
	sequelize
		.sync({ force: false })
		.then(() => {
			console.log("Connection has been established successfully.");
		})
		.catch(err => {
			console.log("Oh no there is somthing went wrong");
		});
});
