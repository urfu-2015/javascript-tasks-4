'use strict';

function GetAllAvailableFriends(collection, startPoint) {
    /*поиском в ширину обходим всех доступных друзей и получаем
    упорядоченный список друзей и расстояние до них*/
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
            if (typeof visited[friends[i]] === 'undefined') {
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
}

module.exports.get = function (collection, startPoint, depth) {
    var currentPoint = startPoint;
    var currentIndex = 0;
    var currentMaleIndex = 0;
    var allFriends = GetAllAvailableFriends(collection, startPoint);

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
                currentMaleIndex = currentIndex;
                /*Вот тут я не понял, как должен вести себя nextMale после того, как мы к
                конкретному контакту обратились. В примерах показано, что prevMale должен
                счтитаться от этого контакте, но разве не должны быть по отдельности next, prev
                и nextMale?*/
                return {name: arguments[0], phone: collection[arguments[0]].phone};
            }
        },
        prev: function () {
            if (arguments[0] === undefined) {
                currentIndex--;
                if (allFriends[currentIndex].distance <= 0) {
                    currentIndex++;
                    return null;
                }
                var currentFriend = allFriends[currentIndex].name;

                return {name: currentFriend, phone: collection[currentFriend].phone};
            } else {
                if (!arguments[0] in collection) {
                    return null;
                }
                return {name: arguments[0], phone: collection[arguments[0]].phone};
            }
        },
        nextMale: function () {
            currentMaleIndex++;
            for (var i = currentMaleIndex; i < allFriends.length; i++) {
                if (allFriends[i].distance > depth) {
                    currentInMaleIndex--;
                    return null;
                }
                if (collection[allFriends[i].name].gender === 'Мужской') {
                    currentMaleIndex = i;
                    var currentFriend = allFriends[i].name;
                    return {name: currentFriend, phone: collection[currentFriend].phone};
                }
            }
        },
        prevMale: function () {
            currentMaleIndex--;
            if (currentMaleIndex < 0) {
                currentMaleIndex++;
                return null;
            }
            for (var i = currentMaleIndex; i > 0; i--) {
                if (collection[allFriends[i].name].gender === 'Мужской') {
                    currentMaleIndex = i;
                    var currentFriend = allFriends[i].name;
                    return {name: currentFriend, phone: collection[currentFriend].phone};
                }
            }
        }
    };
};
