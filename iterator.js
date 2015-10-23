'use strict';

function GetAllAvailableFriends(collection, startPoint, depth) {
    /*поиском в ширину обходим всех доступных друзей и получаем
    упорядоченный список друзей, которые находятся в пределах
    depth кругов рукопожатий*/
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

                if (friendlyContact.distance > depth) {
                    visited[friendlyContact.name] = true;
                    continue;
                }
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
    return -1;
}

function collectionHasChanged(workCollection, collection) {
    return Object.keys(workCollection).length > Object.keys(collection).length;
}

function clearConnections(workCollection, collection) {
    var deletedContactsNames = {};

    Object.keys(workCollection).forEach(function (item) {
        if (!collection.hasOwnProperty(item)) {
            deletedContactsNames[item] = true;
        }
    });
    var newWorkCollection = {};

    Object.keys(workCollection).forEach(function (item) {
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
    var allFriends = GetAllAvailableFriends(workCollection, startPoint, depth);

    return {
        next: function () {
            if (collectionHasChanged(workCollection, collection)) {
                this.handleDeletion();
            }
            if (arguments[0] === undefined) {
                index++;
                if (index >= allFriends.length) {
                    index--;
                    return null;
                }
                return workCollection[allFriends[index].name];
            }
            index = GetFriendIndex(allFriends, arguments[0]);
            if (index === -1) {
                return null;
            }
            return workCollection[allFriends[index].name];
        },
        prev: function () {
            if (collectionHasChanged(workCollection, collection)) {
                this.handleDeletion();
            }
            index--;
            if (index <= 0) {
                index++;
                return null;
            }
            return workCollection[allFriends[index].name];
        },
        nextMale: function () {
            if (collectionHasChanged(workCollection, collection)) {
                this.handleDeletion();
            }
            for (var i = index + 1; i < allFriends.length; i++) {
                if (workCollection[allFriends[i].name].gender === 'Мужской') {
                    index = i;
                    return workCollection[allFriends[index].name];
                }
            }
            return null;
        },
        prevMale: function () {
            if (collectionHasChanged(workCollection, collection)) {
                this.handleDeletion();
            }
            for (var i = index - 1; i > 0; i--) {
                if (workCollection[allFriends[i].name].gender === 'Мужской') {
                    index = i;
                    return workCollection[allFriends[index].name];
                }
            }
            return null;
        },
        handleDeletion: function () {
            workCollection = clearConnections(workCollection, collection);
            var currentFriendName = allFriends[index].name;

            allFriends = GetAllAvailableFriends(workCollection, startPoint, depth);
            index = GetFriendIndex(allFriends, currentFriendName);
            index = index === -1 ? 0 : index;
        }
    };
};
