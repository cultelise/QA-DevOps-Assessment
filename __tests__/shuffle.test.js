const shuffle = require('../src/shuffle');
const bots = require('../src/botsData');

describe('shuffle should...', () => {
	let result = shuffle(bots);

	test('return an array', () => {
		expect(Array.isArray(result)).toBe(true);
	});

	test('return an array of the same length as the argument', () => {
		expect(result.length).toEqual(bots.length);
	});

	// This test iterates through the result array
	// and checks if the bot array includes each item.
	// If the bot array does not contain an item,
	// hasSameItems is set to false.
	test('check that all the same items are in the array', () => {
		let hasSameItems = true;
		result.forEach((item) => {
			if (!bots.includes(item)) {
				hasSameItems = false;
			}
		});
		expect(hasSameItems).toBe(true);
	});

	// This test iterates through the result array
	// and compares each element in result
	// to each element in bots at the same index.
	// If any are not the same, shuffled is set to true.
	test('check that the items have been shuffled', () => {
		let shuffled = false;
		result.forEach((item, index) => {
			if (bots[index] != item) {
				shuffled = true;
			}
		});
		expect(shuffled).toBe(true);
	});
});
