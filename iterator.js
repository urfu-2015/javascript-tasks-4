'use strict';

function getAllAvailableFriends(collection, startPoint, depth) {
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
        var friends = collection[contact.name].friends.slice(0).sort();

        for (var i = 0; i < friends.length; i++) {
            if (visited.hasOwnProperty(friends[i])) {
                continue;
            }
            var friendlyContact = {name: friends[i], distance: contact.distance + 1};

            if (friendlyContact.distance > depth) {
                visited[friendlyContact.name] = true;
                continue;
            }
            distances.push(friendlyContact);
            queue.push(friendlyContact);
            visited[friendlyContact.name] = true;
        }
    }
    return distances;
}

function getFriendIndex(allFriends, friendName) {
    for (var i = 0; i < allFriends.length; i++) {
        if (allFriends[i].name === friendName) {
            return i;
        }
    }
    return -1;
}

function collectionHasChanged(workCollection, collection) {
    return Object.keys(workCollection).length > Object.keys(collection).length;
}

function clearConnections(workCollection, collection) {
    var deletedContactsNames = {};
    var workCollectionKeys = Object.keys(workCollection);

    workCollectionKeys.forEach(function (item) {
        if (!collection.hasOwnProperty(item)) {
            deletedContactsNames[item] = true;
        }
    });
    var newWorkCollection = {};

    workCollectionKeys.forEach(function (item) {
        if (deletedContactsNames.hasOwnProperty(item)) {
            return;
        }
        var clearedFriends = [];

        workCollection[item].friends.forEach(function (friend) {
            if (!deletedContactsNames.hasOwnProperty(friend)) {
                clearedFriends.push(friend);
            }
        });
        newWorkCollection[item] = {
            name: workCollection[item].name,
            gender: workCollection[item].gender,
            phone: workCollection[item].phone,
            friends: clearedFriends
        };
    });
    return newWorkCollection;
}

module.exports.get = function (collection, startPoint, depth) {
    depth = depth || Number.MAX_VALUE;
    var workCollection = Object.assign({}, collection);
    var index = 0;
    var allFriends = getAllAvailableFriends(workCollection, startPoint, depth);

    return {
        next: function (toName) {
            this.handleDeletion();
            if (typeof toName !== 'string') {
                if (index >= allFriends.length - 1) {
                    return null;
                }
                index++;
                var friend = allFriends[index].name;

                return {name: friend, phone: workCollection[friend].phone};
            }
            index = getFriendIndex(allFriends, arguments[0]);
            if (index === -1) {
                return null;
            }
            var friend = allFriends[index].name;

            return {name: friend, phone: workCollection[friend].phone};
        },
        prev: function () {
            this.handleDeletion();
            if (index <= 1) {
                return null;
            }
            index--;
            var friend = allFriends[index].name;

            return {name: friend, phone: workCollection[friend].phone};
        },
        nextMale: function () {
            this.handleDeletion();
            for (var i = index + 1; i < allFriends.length; i++) {
                if (workCollection[allFriends[i].name].gender === 'Мужской') {
                    index = i;
                    var friend = allFriends[index].name;

                    return {name: friend, phone: workCollection[friend].phone};
                }
            }
            return null;
        },
        prevMale: function () {
            this.handleDeletion();
            for (var i = index - 1; i > 0; i--) {
                if (workCollection[allFriends[i].name].gender === 'Мужской') {
                    index = i;
                    var friend = allFriends[index].name;

                    return {name: friend, phone: workCollection[friend].phone};
                }
            }
            return null;
        },
        handleDeletion: function () {
            if (!collectionHasChanged(workCollection, collection)) {
                return;
            }
            workCollection = clearConnections(workCollection, collection);
            var currentFriendName = allFriends[index].name;

            allFriends = getAllAvailableFriends(workCollection, startPoint, depth);
            index = getFriendIndex(allFriends, currentFriendName);
            index = index === -1 ? 0 : index;
        }
    };
};
