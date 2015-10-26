'use strict';

function checkExistence(collection, friend) {
    var isExist = false;
    Object.keys(collection).forEach(function () {
        if (collection.hasOwnProperty(friend)) {
            isExist = true;
        }
    });
    return isExist;
}

function BFS(collection, startPoint, depth) {
    var queue = [];
    var visited = {};
    var guests = {};
    if (checkExistence(collection, startPoint)) {
        var k = 0;
        queue.push(startPoint);
        guests[startPoint] = collection[startPoint];
        visited[startPoint] = 0;
        while (queue.length !== 0) {
            var node = queue.shift();

            if (visited[node] >= depth) {
                break;
            }

            collection[node].friends = collection[node].friends.sort(function (a, b) {
                return a > b;
            });
            collection[node].friends.forEach(function (friend, index, faceBook) {
                if (!visited[friend]) {
                    queue.push(friend);
                    guests[friend] = collection[friend];
                    visited[friend] = visited[node] + 1;
                }
            });
        }
    }
    //console.log(guests);
    return guests;
}

module.exports.get = function (collection, startPoint) {
    var depth = arguments[2] || Infinity;
    var sutableFriends = BFS(collection, startPoint, depth);
    var friend = {};
    var k = 0;
    var namesOfFriends = Object.getOwnPropertyNames(sutableFriends);
    return {
        next: function () {
            var latePerson = arguments[0];
            if (latePerson === undefined) {
                if (sutableFriends[startPoint] === undefined || k >= namesOfFriends.length) {
                    return null;
                }
                friend.name = namesOfFriends[++k];
                friend.phone = sutableFriends[friend.name].phone;
            } else {
                if (sutableFriends[latePerson] === undefined) {
                    return null;
                }
                friend.name = latePerson;
                friend.phone = sutableFriends[latePerson].phone;
            }
            return friend;
        },
        prev: function () {
            if (sutableFriends[startPoint] === undefined || k <= 0) {
                return null;
            }
            friend.name = namesOfFriends[--k];
            friend.phone = sutableFriends[friend.name].phone;
            return friend;
        },
        nextMale: function () {
            do {
                friend = this.next();
            } while (sutableFriends[friend.name].gender !== 'Мужской' && friend !== null);
            return friend;
        },
        prevMale: function () {
            do {
                friend = this.prev();
            } while (sutableFriends[friend.name].gender !== 'Мужской' && friend !== null);
            return friend;
        }
    };
};
