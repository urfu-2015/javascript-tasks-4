'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var depth = depth || Infinity;
    var friends = getFriends(collection, startPoint, -1, depth).slice(1); // убрали startPoint
    friends = friends.sort(function (elementFirst, elementSecond) {
            if (elementFirst.name < elementSecond.name) {
                return -1;
            }
                return 1;
        });
    var indexFriend = -1;
    return {
        next: function (name) {
            if (name) {
                var person = friends.filter(function (friend) {

                    return friend.name === name;
                });
                if (person) {
                    return {name: name, phone: person.phone};
                }
            }
            if (friends[indexFriend + 1]) {
                var friend = {
                    name: friends[indexFriend + 1].name, 
                    phone: friends[indexFriend + 1].phone
                };
                indexFriend++;

                return friend;
            }
            return null;
        },
        prev: function () {
            if (friends[indexFriend - 1]) {
                var friend = {
                    name: friends[indexFriend - 1].name, 
                    phone: friends[indexFriend - 1].phone
                };
                indexFriend--;

                return friend;
            }
            return null;
        },
        nextMale: function () {
            while (friends[indexFriend + 1]) {
                if (friends[indexFriend + 1].gender === 'Мужской') {
                    return friends[++indexFriend];
                } else {
                    indexFriend++;
                }
            }
            return null;
        },
        prevMale: function () {
            while (friends[indexFriend - 1]) {
                if (friends[indexFriend - 1].gender === 'Мужской') {
                    return friends[--indexFriend];
                } else {
                    indexFriend--;
                }
            }
            return null;
        }
    }
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