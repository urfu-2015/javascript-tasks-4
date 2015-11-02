'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var friendsOrder = createFriendsOrder(collection, startPoint, depth);
    var currentIndex = 0;
    var currentName = undefined;
    var currentCollectionLength = Object.keys(collection).length;
    var iterateAndGetElement = function (positions) {
        var newIndex = currentIndex + positions;
        if (newIndex >= 0 && newIndex < friendsOrder.length) {
            currentIndex = newIndex;
            currentName = friendsOrder[currentIndex];
            return {
                name: currentName,
                phone: collection[currentName].phone,
                gender: collection[currentName].gender
            };
        } else {
            return null;
        }
    };
    var updateFriendsOrder = function () {
        if (currentCollectionLength == Object.keys(collection).length) {
            return;
        }
        var newFriendsOrder = createFriendsOrder(collection, startPoint, depth);
        currentCollectionLength = Object.keys(collection).length;
        currentIndex = newFriendsOrder.indexOf(currentName);
        if (currentIndex == -1) {
            currentIndex--;
        }
        friendsOrder = newFriendsOrder;
    };
    var iterateWithPredicate = function (positions, predicate) {
        var friend = iterateAndGetElement(positions);
        while (friend !== null && !predicate(friend)) {
            friend = iterateAndGetElement(positions);
        }
        return friend;
    };
    var getFormattedFriend = function (friend) {
        if (friend === null) {
            return friend;
        }
        return {
            name: friend.name,
            phone: friend.phone
        };
    };
    var iterateMale = function (positions) {
        var answerFriend = iterateWithPredicate(positions, function (friend) {
            return friend.gender === 'Мужской';
        });
        return answerFriend;
    };
    var iterateWithName = function (name, positions) {
        var answerFriend;
        if (name === undefined) {
            answerFriend = iterateAndGetElement(positions);
        } else {
            answerFriend = iterateWithPredicate(positions, function (friend) {
                return friend.name === name;
            });
        }
        return answerFriend;
    };
    var getNextMale = function () {
        updateFriendsOrder();
        return getFormattedFriend(iterateMale(1));
    };
    var getPrevMale = function () {
        updateFriendsOrder();
        return getFormattedFriend(iterateMale(-1));
    };
    var getNextWithName = function (name) {
        updateFriendsOrder();
        return getFormattedFriend(iterateWithName(name, 1));
    };
    var getPrevWithName = function (name) {
        updateFriendsOrder();
        return getFormattedFriend(iterateWithName(name, -1));
    };
    return {
        next: getNextWithName,
        prev: getPrevWithName,
        nextMale: getNextMale,
        prevMale: getPrevMale
    };
};

function createFriendsOrder(collection, startPoint, depth) {
    if (collection[startPoint] === undefined) {
        return [];
    }
    var friendsOrder = [];
    depth = depth !== undefined ? depth : Object.keys(collection).length;
    var nowDepth = 0;
    var thisDepthQueue = [];
    var nextDepthQueue = [];
    friendsOrder.push(startPoint);
    thisDepthQueue.push(startPoint);
    while (nowDepth < depth) {
        if (thisDepthQueue.length == 0) {
            break;
        }
        var nowName = thisDepthQueue.shift();
        collection[nowName].friends.sort().forEach(function (friendName) {
            if (friendsOrder.indexOf(friendName) == -1 && collection[friendName] !== undefined) {
                friendsOrder.push(friendName);
                nextDepthQueue.push(friendName);
            }
        });
        if (thisDepthQueue.length == 0) {
            nowDepth++;
            var swapQueue = thisDepthQueue;
            thisDepthQueue = nextDepthQueue;
            nextDepthQueue = swapQueue;
        }
    }
    return friendsOrder;
}
