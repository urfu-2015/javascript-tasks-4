'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var friendsOrder = __createFriendsOrder(collection, startPoint, depth);
    var currentIndex = -1;
    var getNext = function () {
        currentIndex++;
        if (currentIndex >= friendsOrder.length) {
            currentIndex--;
            return null;
        }
        var currentName = friendsOrder[currentIndex];
        return {
            name: currentName,
            phone: collection[currentName].phone,
            gender: collection[currentName].gender
        };
    };
    var getPrev = function () {
        currentIndex--;
        if (currentIndex <= -1) {
            currentIndex++;
            return null;
        }
        var currentName = friendsOrder[currentIndex];
        return {
            name: currentName,
            phone: collection[currentName].phone,
            gender: collection[currentName].gender
        };
    };
    var getNextWithName = function (name) {
        var answerFriend = getNext();
        if (name !== undefined) {
            while (answerFriend !== null && answerFriend.name != name) {
                answerFriend = getNext();
            }
        }
        if (answerFriend === null) {
            return answerFriend;
        }
        return {
            name: answerFriend.name,
            phone: answerFriend.phone
        };
    };
    var getNextMale = function () {
        var currentFriend = getNext();
        while (currentFriend !== null && currentFriend.gender != 'Мужской') {
            currentFriend = getNext();
        }
        if (answerFriend === null) {
            return answerFriend;
        }
        return {
            name: currentFriend.name,
            phone: currentFriend.phone
        };
    };
    var getPrevMale = function () {
        var currentFriend = getPrev();
        while (currentFriend !== null && currentFriend.gender != 'Мужской') {
            currentFriend = getPrev();
        }
        if (answerFriend === null) {
            return answerFriend;
        }
        return {
            name: currentFriend.name,
            phone: currentFriend.phone
        };
    };
    var getPrevWithName = function (name) {
        var answerFriend = getPrev();
        if (name !== undefined) {
            while (answerFriend !== null && answerFriend.name != name) {
                answerFriend = getPrev();
            }
        }
        if (answerFriend === null) {
            return answerFriend;
        }
        return {
            name: answerFriend.name,
            phone: answerFriend.phone
        };
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
    depth = depth || collection.length;
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
