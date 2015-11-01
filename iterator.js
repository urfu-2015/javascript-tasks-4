'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var depth = depth || Infinity;
    var indexFriend = -1;
    var friends = getFriends(collection, startPoint, indexFriend, depth).slice(1); // убрали startPoint
    friends = friends.sort(function (a, b) {
           return a.name > b.name;
        });
    return {
        next: function (name) {
            if (name) {
                var person = friends.filter(function (friend) {
                    return friend.name === name;
                });
                if (person && person.length) {
                    return {name: name, phone: person[0].phone};
                }
            }
            if (friends[indexFriend + 1]) {
                indexFriend++;
                
                return {
                    name: friends[indexFriend].name, 
                    phone: friends[indexFriend].phone
                };
            }
            return null;
        },
        prev: function () {
            if (friends[indexFriend - 1]) {
                indexFriend--;

                return {
                    name: friends[indexFriend].name, 
                    phone: friends[indexFriend].phone
                };
            }
            return null;
        },
        nextMale: function () {
            while (friends[indexFriend + 1]) {
                ++indexFriend;
                if (friends[indexFriend].gender === 'Мужской') {
                    return friends[indexFriend];
                }
            }
            return null;
        },
        prevMale: function () {
            while (friends[indexFriend - 1]) {
                indexFriend--;
                if (friends[indexFriend].gender === 'Мужской') {
                    return friends[indexFriend];
            }
            return null;
        }
    }
};
};
function getFriends (data, name, current, depth, result) {
    result = result || [];
    var person = data[name];
    if (!person) {
        return result;
    }
    result.push({ name: name, phone: person.phone, gender: person.gender });
    var friends = person.friends;
    delete data[name];
    return (++current < depth && friends && friends.length) ?
        friends.reduce(function(result, name) {
            return getFriends(data, name, current, depth, result);
        }, result) : result;
}
