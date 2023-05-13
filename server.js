require('dotenv').config();
const express = require('express');
const bots = require('./src/botsData');
const shuffle = require('./src/shuffle');
const Rollbar = require('rollbar');

const { ROLLBAR_ACCESS_TOKEN } = process.env;

const playerRecord = {
	wins: 0,
	losses: 0,
};
const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const rollbar = new Rollbar({
	accessToken: ROLLBAR_ACCESS_TOKEN,
	captureUncaught: true,
	captureUnhandledRejections: true,
});

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
	robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
	robots
		.map(({ attacks }) =>
			attacks.reduce((total, { damage }) => total + damage, 0)
		)
		.reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
	const compAttack = calculateTotalAttack(compDuo);
	const playerHealth = calculateTotalHealth(playerDuo);
	const playerAttack = calculateTotalAttack(playerDuo);
	const compHealth = calculateTotalHealth(compDuo);

	return {
		compHealth: compHealth - playerAttack,
		playerHealth: playerHealth - compAttack,
	};
};

app.get('/api/robots', (req, res) => {
	try {
		rollbar.log('robot list requested');
		// throw new Error('testing rollbar');
		res.status(200).send(bots);
	} catch (error) {
		rollbar.critical('error getting bots', error);
		console.error('ERROR GETTING BOTS', error);
		res.sendStatus(400);
	}
});

app.get('/api/robots/shuffled', (req, res) => {
	try {
		let shuffled = shuffle(bots);
		res.status(200).send(shuffled);
	} catch (error) {
		console.error('ERROR GETTING SHUFFLED BOTS', error);
		res.sendStatus(400);
	}
});

app.post('/api/duel', (req, res) => {
	try {
		rollbar.log('duel initiated');
		// throw new Error('testing rollbar');
		const { compDuo, playerDuo } = req.body;

		const { compHealth, playerHealth } = calculateHealthAfterAttack({
			compDuo,
			playerDuo,
		});

		// comparing the total health to determine a winner
		if (compHealth > playerHealth) {
			playerRecord.losses += 1;
			res.status(200).send('You lost!');
		} else {
			playerRecord.losses += 1;
			res.status(200).send('You won!');
		}
	} catch (error) {
		rollbar.critical('error dueling', error);
		console.log('ERROR DUELING', error);
		res.sendStatus(400);
	}
});

app.get('/api/player', (req, res) => {
	try {
		rollbar.log('player record requested');
		// throw new Error('testing rollbar');
		res.status(200).send(playerRecord);
	} catch (error) {
		rollbar.critical('error retrieving player stats', error);
		console.log('ERROR GETTING PLAYER STATS', error);
		res.sendStatus(400);
	}
});

app.listen(8000, () => {
	console.log(`Listening on 8000`);
});
