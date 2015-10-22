'use strict';

function GetAllAvailableFriends(collection, startPoint) {
    /*поиском в ширину обходим всех доступных друзей и получаем
    упорядоченный список друзей и расстояние до них*/
    if (!Object.hasAttribute(startPoint)) {
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
            if (Object.hasAttribute(visited[friends[i]])) {
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
    var currentPoint = startPoint;
    var currentIndex = 0;
    var allFriends = GetAllAvailableFriends(collection, startPoint);

    depth = depth || Number.MAX_VALUE;
    return {
        next: function () {
            if (arguments[0] === undefined) {
                currentIndex++;
                if (allFriends[currentIndex].distance > depth || currentIndex >= allFriends.length) {
                    currentIndex--;
                    return null;
                }
                var currentFriend = allFriends[currentIndex].name;

                return {name: currentFriend, phone: collection[currentFriend].phone};
            } else {
                if (!arguments[0] in collection) {
                    return null;
                }
                currentIndex = GetFriendIndex(allFriends, arguments[0]);
                if (typeof currentIndex === 'undefined') {
                    return null;
                }
                var currentFriend = allFriends[currentIndex].name;

                return {name: currentFriend, phone: collection[currentFriend].phone};
            }
        },
        prev: function () {
            currentIndex--;
            if (allFriends[currentIndex].distance <= 0) {
                currentIndex++;
                return null;
            }
            var currentFriend = allFriends[currentIndex].name;

            return {name: currentFriend, phone: collection[currentFriend].phone};
        },
        nextMale: function () {
            currentIndex++;
            for (var i = currentIndex; i < allFriends.length; i++) {
                if (allFriends[i].distance > depth) {
                    currentInMaleIndex--;
                    return null;
                }
                if (collection[allFriends[i].name].gender === 'Мужской') {
                    currentIndex = i;
                    var currentFriend = allFriends[i].name;
                    return {name: currentFriend, phone: collection[currentFriend].phone};
                }
            }
        },
        prevMale: function () {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex++;
                return null;
            }
            for (var i = currentIndex; i > 0; i--) {
                if (collection[allFriends[i].name].gender === 'Мужской') {
                    currentIndex = i;
                    var currentFriend = allFriends[i].name;
                    return {name: currentFriend, phone: collection[currentFriend].phone};
                }
            }
        }
    };
};
