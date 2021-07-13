const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const Game = sequelize.define(
	"Player",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		playerId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		dice1: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		dice2: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		won: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "game",
	}
);

module.exports = Game;
