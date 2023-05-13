const { Builder, Browser, By, until } = require('selenium-webdriver');

let driver;

beforeEach(async () => {
	driver = await new Builder().forBrowser(Browser.CHROME).build();
	await driver.get('http://localhost:8000');
});

afterEach(async () => {
	await driver.quit();
});

describe('Duel Duo tests', () => {
	test('page loads with title', async () => {
		await driver.wait(until.titleIs('Duel Duo'), 1000);
	});

	test('"See All Bots" button displays "all-bots" div', async () => {
		await driver.findElement(By.id('see-all')).click();
		let botsDiv = await driver.findElement(By.id('all-bots'));

		expect(await botsDiv.getAttribute('id')).toBe('all-bots');
	});

	test('duel button changes results text', async () => {
		// initiates duel
		await driver.findElement(By.id('draw')).click();
		await driver.findElement(By.className('bot-btn')).click();
		await driver.findElement(By.className('bot-btn')).click();
		await driver.findElement(By.id('duel')).click();

		let results = await driver.findElement(By.id('results'));

		expect(await results.getText()).toBe('Dueling...');
	});

	test('loss counter changes after duel', async () => {
		// saves initial loss counter text
		let losses = await driver.findElement(By.id('losses'));
		let lossesText = await losses.getText();

		// initiates duel
		await driver.findElement(By.id('draw')).click();
		await driver.findElement(By.className('bot-btn')).click();
		await driver.findElement(By.className('bot-btn')).click();
		await driver.findElement(By.id('duel')).click();

		// waits until the duel is finished
		await driver.wait(async () => {
			let results = await driver.findElement(By.id('results'));
			return (await results.getText()) != 'Dueling...';
		}, 5000);

		// saves new loss counter text
		let newLosses = await driver.findElement(By.id('losses'));
		let newLossesText = await newLosses.getText();

		expect(lossesText).not.toBe(newLossesText);
	});
});
