'use strict';

module.exports.get = function (collection, startPoint, depth) {
	var friends = getFriends(collection, startPoint, 0, depth);
	var indexFriend = 0;
	return {
		next: function () {
			// проверка 
			return friends[indexFriend + 1] ? frineds[++indexFriend] : null;

		},

		prev: function () {
			return friends[indexFriend - 1] ? friends[--indexFriend] : null;
		},

		nextMale: function () {
			while(friends[indexFriend]) {
				if (collection[frineds[indexFriend + 1].gender] === 'мужской') {
					return friends[++indexFriend];
				} else {
					indexFriend++;
				}
			}
			return null;
		}

		prevMale: function () {
			while(friends[indexFriend]) {
				if (collection[frineds[indexFriend - 1].gender] === 'мужской') {
					return friends[--indexFriend];
				} else {
					indexFriend--;
				}
			}
			return null;
		}
	}
};

/*function getFriends (data, name, current, depth, result) {
    var persons = data[name].friends;
    var node = data[name];

    if (persons.length === 0) {
        return result;
    }

    result.push({ name: name, phone: node.phone});
    current++;
    persons.reduce(function (name1) {
        if (current < depth){
            result.concat(data[name1]).map(function (name2) {
                return getFriends(data, name2, current, depth, result);
            });
        } else {
            return result;
    }
   }, result);
}
*/
