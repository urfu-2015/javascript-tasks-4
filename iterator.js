'use strict';

function GetAllAvailableFriends(collection, startPoint) {
    /*поиском в ширину обходим всех доступных друзей и получаем
    упорядоченный список друзей и расстояние до них*/
    if (!collection.hasOwnProperty(startPoint)) {
        return [{}];
    }
    var distances = [];
    var queue = [];
    var visited = {};

    queue.push({name: startPoint, distance: 0});
    distances.push({name: startPoint, distance: 0});
    visited[startPoint] = true;
    while (queue.length > 0) {
        var contact = queue.shift();
        var friends = collection[contact.name].friends.sort();

        for (var i = 0; i < friends.length; i++) {
            if (!visited.hasOwnProperty(friends[i])) {
                var friendlyContact = {name: friends[i], distance: contact.distance + 1};

                distances.push(friendlyContact);
                queue.push(friendlyContact);
                visited[friendlyContact.name] = true;
            }
        }
    }
    return distances;
}

function GetFriendIndex(allFriends, friendName) {
    for (var i = 0; i < allFriends.length; i++) {
        if (allFriends[i].name === friendName) {
            return i;
        }
    }
    return undefined;
}

function GetFriendByIndex(collection, friends, index) {
    var friend = friends[index].name;
    return {name: friend, phone: collection[friend].phone};
}

module.exports.get = function (collection, startPoint, depth) {
    var currentPoint = startPoint;
    var currentIndex = 0;
    var allFriends = GetAllAvailableFriends(collection, startPoint);

    depth = depth || Number.MAX_VALUE;
    return {
        next: function () {
            if (arguments[0] === undefined) {
                currentIndex++;
                if (currentIndex >= allFriends.length || allFriends[currentIndex].distance > depth) {
                    currentIndex--;
                    return null;
                }
                return GetFriendByIndex(collection, allFriends, currentIndex);
            } else {
                if (!arguments[0] in collection) {
                    return null;
                }
                currentIndex = GetFriendIndex(allFriends, arguments[0]);
                if (typeof currentIndex === 'undefined') {
                    return null;
                }
                return GetFriendByIndex(collection, allFriends, currentIndex);
            }
        },
        prev: function () {
            currentIndex--;
            if (currentIndex <= 0 || allFriends[currentIndex].distance <= 0) {
                currentIndex++;
                return null;
            }
            return GetFriendByIndex(collection, allFriends, currentIndex);
        },
        nextMale: function () {
            currentIndex++;
            for (var i = currentIndex; i < allFriends.length; i++) {
                if (allFriends[i].distance > depth) {
                    currentIndex--;
                    return null;
                }
                if (collection[allFriends[i].name].gender === 'Мужской') {
                    currentIndex = i;
                    return GetFriendByIndex(collection, allFriends, currentIndex);
                }
            }
            return null;
        },
        prevMale: function () {
            currentIndex--;
            if (currentIndex <= 0) {
                currentIndex++;
                return null;
            }
            for (var i = currentIndex; i > 0; i--) {
                if (collection[allFriends[i].name].gender === 'Мужской') {
                    currentIndex = i;
                    return GetFriendByIndex(collection, allFriends, currentIndex);
                }
            }
            return null;
        }
    };
};
