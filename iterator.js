'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var friendsOrder = __createFriendsOrder(collection, startPoint, depth);
    var currentIndex = -1;
    var iterateAndGetElement = function (positions) {
        if (currentIndex + positions >= 0 && currentIndex + positions < friendsOrder.length) {
            currentIndex += positions;
            var currentName = friendsOrder[currentIndex];
            return {
                name: currentName,
                phone: collection[currentName].phone,
                gender: collection[currentName].gender
            };
        } else {
            return null;
        }
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
        return getFormattedFriend(iterateMale(1));
    };
    var getPrevMale = function () {
        return getFormattedFriend(iterateMale(-1));
    };
    var getNextWithName = function (name) {
        return getFormattedFriend(iterateWithName(name, 1));
    };
    var getPrevWithName = function (name) {
        return getFormattedFriend(iterateWithName(name, -1));
    };
    return {
        next: getNextWithName,
        prev: getPrevWithName,
        nextMale: getNextMale,
        prevMale: getPrevMale
    };
};

function __createFriendsOrder(collection, startPoint, depth) {
    if (collection[startPoint] === undefined) {
        return [];
    }
    var friendsOrder = [];
    depth = depth || Object.keys(collection).length;
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
            if (friendsOrder.indexOf(friendName) == -1) {
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
    friendsOrder.splice(0, 1);
    return friendsOrder;
}
