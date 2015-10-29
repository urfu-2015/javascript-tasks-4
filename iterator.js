'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var depth = depth || Infinity;
    var friends = getFriends(collection, startPoint, -1, depth).sort(function (elementFirst, elementSecond) {
            if (elementFirst.name < elementSecond.name) {
                return -1;
            }
                return 1;
        });
    var indexFriend = 0;
    console.log(friends);
    return {
        next: function () {
            if (friends[indexFriend + 1]) {
                var friend = {name: friends[indexFriend + 1].name, phone: friends[indexFriend + 1].phone};
                indexFriend++;

                return friend;
            }
        },

        prev: function () {
            if (friends[indexFriend - 1]) {
                var friend = {name: friends[indexFriend - 1].name, phone: friends[indexFriend - 1].phone};
                indexFriend--;

                return friend;
            }
        },
        nextMale: function () {
            while (friends[indexFriend + 1]) {
                if (friends[indexFriend + 1].gender === 'мужской') {
                    return friends[++indexFriend];
                } else {
                    indexFriend++;
                }
            }
            return null;
        },

        prevMale: function () {
            while (friends[indexFriend - 1]) {
                if (friends[indexFriend + 1].gender === 'мужской') {
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