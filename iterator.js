'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        depth = collection.length;
    }
    var friends = getFriends (collection, startPoint, depth);
    var numberFriends = friends.length;
    var currentNumber = 0;
    return {
        next: function (name) {
            if (Object.keys(collection).indexOf(startPoint) === -1 ||
                currentNumber >= numberFriends) {
                return null;
            }
            currentNumber++;
            if (typeof name === undefined) {
                return {name: friends[currentNumber], phone: friends.phone};
            }
            while (friends[currentNumber] !== name) {
                currentNumber++;
                if (currentNumber === numberFriends) {
                    break;
                }
            }
            return {name: friends[currentNumber], phone: friends.phone};
        },
        nextMale: function (name) {
            var nextfriend = this.next(name);
            while (nextfriend !== null) {
                if (collection[nextfriend.name].gender === 'Мужской') {
                    return nextfriend;
                }
                nextfriend = this.next();
            }
            return null;
        }
    };
};

function getFriends (collection, startPoint, depth) {
    var friends = [];
    if (Object.keys(collection).indexOf(startPoint) === -1) {
        return friends;
    }
    var currentFriend = {name: startPoint, countHandshake: 0};
    var name = currentFriend.name;
    var queue = [currentFriend];
    var addedNames = [startPoint];
    while (queue.length !== 0) {
        currentFriend = queue.shift();
        if (currentFriend.countHandshake > depth) {
            break;
        }
        var currentFriends = collection[name].friends.sort();
        for (var i = 0; i < currentFriends.length; i++) {
            if (addedNames.indexOf(currentFriends[i]) === -1) {
                queue.push({
                    name: currentFriends[i],
                    countHandshake: currentFriend.countHandShake + 1
                });
                friends.push(collection[currentFriends[i]]);
                addedNames.push(currentFriends[i]);
            }
        }
    }
    return friends;
}
