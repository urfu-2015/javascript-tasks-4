'use strict';

module.exports.get = function (collection, startPoint, depth) {
	var result = [null];
	var badVar;
	var currentFriendIndex = 1;
	var currentDudeIndex = 0;
	if (!(startPoint in collection)) {
		badVar = false;
	} else {
		var queue = [];
		var used = [];
		var d = {};
		for (var el in collection) {
			d[el] = 0;
		}
		queue.push(startPoint);
		used.push(startPoint);
		main: while (queue.length != 0) {
			var currentFriend = queue.shift();
			for (var i = 0; i < collection[currentFriend].friends.sort().length; i++) {
				var hisFriend = collection[currentFriend].friends[i];
				if (used.indexOf(hisFriend) == -1) {
					d[hisFriend] = d[currentFriend] + 1;
					if (d[hisFriend] > depth) {
						break main;
					}
					used.push(hisFriend);
					queue.push(hisFriend);
					result.push(getOutput(hisFriend));
				}
			}
		}
	}

	function getNext() {
		if (!badVar) {
			if (currentFriendIndex < result.length) {
				console.log(result[currentFriendIndex]);
				currentFriendIndex++;
			} else {
				console.log(null);
			}
		} else {
			console.log(null);
		}
	};

	function getPrev() {
		if ((result.length - currentFriendIndex) == 2) {
			currentFriendIndex -= 2;
		} else {
			currentFriendIndex--;
		}
		if (currentFriendIndex <= 0) {
			console.log(null);
			currentFriendIndex = 1;
		} else {
			console.log(result[currentFriendIndex]);
		}
	};

	function getOutput(name) {
		var temp_result = {};
		temp_result['name'] = name;
		temp_result['phone'] = collection[name]['phone'];
		return temp_result;
	};

	// function searchNextMale() {
	// 	while (collection[result[currentDudeIndex]['name']].gender != 'Мужской') {
	// 		currentDudeIndex++;
	// 	}
	// 	return currentDudeIndex;
	// };

	// function getNextMale() {
	// 	console.log('dude', result[searchNextMale()]);
	// };

	return {
		next: getNext,
		prev: getPrev
		// nextMale: getNextMale
	}
};
