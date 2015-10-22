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

module.exports.get = function (collection, startPoint, depth) {
    var index = 0;
    var allFriends = GetAllAvailableFriends(collection, startPoint);

    depth = depth || Number.MAX_VALUE;
    return {
        next: function () {
            if (arguments[0] === undefined) {
                index++;
                if (index >= allFriends.length || allFriends[index].distance > depth) {
                    index--;
                    return null;
                }
                return collection[allFriends[index].name];
            } else {
                if (!arguments[0] in collection) {
                    return null;
                }
                index = GetFriendIndex(allFriends, arguments[0]);
                if (typeof index === 'undefined') {
                    return null;
                }
                return collection[allFriends[index].name];
            }
        },
        prev: function () {
            index--;
            if (index <= 0 || allFriends[index].distance <= 0) {
                index++;
                return null;
            }
            return collection[allFriends[index].name];
        },
        nextMale: function () {
            index++;
            for (var i = index; i < allFriends.length; i++) {
                if (allFriends[i].distance > depth) {
                    index--;
                    return null;
                }
                if (collection[allFriends[i].name].gender === 'Мужской') {
                    index = i;
                    return collection[allFriends[index].name];
                }
            }
            return null;
        },
        prevMale: function () {
            index--;
            if (index <= 0) {
                index++;
                return null;
            }
            for (var i = index; i > 0; i--) {
                if (collection[allFriends[i].name].gender === 'Мужской') {
                    index = i;
                    return collection[allFriends[index].name];
                }
            }
            return null;
        }
    };
};
