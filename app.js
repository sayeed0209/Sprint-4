const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const sequelize = require("./database/db");
const {Sequelize} = require('sequelize')
const Player = require("./models/Player");
const Game = require("./models/Game");
require("./models/association");
app.use(express.json());

const getAvgScore = async ()=>{
	const players = await Player.findAll({
		include:[{model:Game , attributes:['won']}],
		
	});
	const avgScore =[]
	
	players.forEach((player,index) =>{
		avgScore[index] = ({name:player.username,rollDice:0,wonGame:0})
		player.Games.forEach(game => {
			avgScore[index].rollDice += 1
			if(game.won === 1 ){
				avgScore[index].wonGame +=1
			}
		})

		avgScore[index].avgScore = (avgScore[index].wonGame / avgScore[index].rollDice) * 100 
	})
	return avgScore
}
app.get("/", async(req, res) => {
	const date = Date.now();
	try{
		Player.create({
			// username:'sayeed'
		}).then(user => {
		res.json(user);
	});
	}catch(err){
		res.json(err);
	}
	
});

app.get("/players", async (req, res) => {
	// let avgScore = await getAvgScore()
	let avgScore = await Game.findAll({
		include:[{model:Player,attributes:['username']}],
		attributes:[[Sequelize.fn('AVG',Sequelize.col('won')),'avgScore']],
		group:['PlayerID']
	
	})
	res.json(avgScore);
});

app.get("/players/:id/games", async (req, res) => {
	const players = await Player.findOne({where: {id: req.params.id},
		include:[{model:Game }],
		
	});
	res.json(players)
})
app.get('/players/ranking',async(req,res)=>{
	const ranking = await Game.findAll({
		attributes:[[Sequelize.fn('AVG',Sequelize.col('won')),'avgRanking'],[Sequelize.fn('count',Sequelize.col('id')),'diceRollCount']]
		
	})

	res.json(ranking)
	
})

app.get('/players/ranking/loser',async(req,res)=>{
	const loser = await Game.findOne({
		include:[{model:Player,attributes:['username']}],
		attributes:[[Sequelize.fn('AVG',Sequelize.col('won')),'avgScore']],
		group:['PlayerID'],
		order:[[Sequelize.fn('AVG',Sequelize.col('won'))]]
	
	})
	res.json(loser);
} )
app.get("/players/:id", async (req, res) => {
	const player = await Player.findOne({where:{ id: req.params.id }});
	res.json(player);
});
app.get("/a/players/:id", async (req, res) => {
	const a = Math.floor(Math.random() * 7) + 1;
	const b = Math.floor(Math.random() * 7) + 1;
	const result = a + b;
	let won = 0;
	if (result === 7)won = 1;
	
	await Game.create({
		PlayerId: req.params.id,
		dice1: a,
		dice2: b,
		won: won,
	}).then(user => {
		res.json(user);
	});
});

app.get("/players/update/:id", async (req, res) => {
	const player = await Player.findOne({ where: { id: req.params.id } });
	await player.update({ username: "Sayeed" }, { where: { id: req.params.id } });
});

app.listen(PORT, () => {
	console.log(` App runing on port http://localhost:${PORT}`);

	sequelize
		.sync({ force: false })
		.then(() => {
			console.log("Connection has been established successfully.");
		})
		.catch(err => {
			console.log("Oh no there is somthing went wrong" + err);
		});
});
