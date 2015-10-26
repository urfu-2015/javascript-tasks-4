'use strict';

function doesUserExists(collection, userName) {
    if (collection[userName]) {
        return true;
    } else {
        return false;
    }
    //return !!collection[userName];
}

function getFriends(collection, startPoint, usedFriends) {
    var friendsQueue = [];
    var startPointFriends = collection[startPoint]['friends'];
    startPointFriends = startPointFriends.sort();
    var startPointNewFriends = [];
    //console.log(startPointFriends);
    var startPointFriendsLen = startPointFriends.length;
    for (var f = 0; f < startPointFriendsLen; ++f) {
        if (!doesUserExists(usedFriends, startPointFriends[f])) {
            startPointNewFriends.push(startPointFriends[f]);
        }
    }
    //console.log(startPointNewFriends);
    return startPointNewFriends;
}

module.exports.get = function (collection, startPoint, depth) {
    depth = depth || collection.length;
    var currDepth = 0;
    var currIndex = 0;
    var currFriends = [startPoint];
    var newLevel = [];
    var usedFriends = {};
    usedFriends[startPoint] = collection[startPoint];
    return {
        next: function (name) {
            if (!doesUserExists(collection, startPoint)) {
                return null;
            }
            if (currDepth < depth) {
                var tmpFriends = getFriends(collection, currFriends[currIndex], usedFriends);
                if (!currDepth && !tmpFriends.length) {
                    return null;
                }
                newLevel = newLevel.concat(tmpFriends);
                tmpFriends.forEach(function (item) {
                    usedFriends[item] = collection[item];
                });
                currIndex++;
                if (currIndex === currFriends.length) {
                    currFriends = currFriends.concat(newLevel);
                    newLevel = [];
                    currDepth++;
                }
                var toShow = {};
                toShow['name'] = currFriends[currIndex];
                toShow['phone'] = collection[currFriends[currIndex]]['phone'];
                console.log(toShow);
                //yield toShow; // А так хотелось
                return toShow;
            }
            return null;
        },
        prev: function () {
            if (currIndex > 0) {
                currIndex--;
                var toShow = {};
                toShow['name'] = currFriends[currIndex];
                toShow['phone'] = collection[currFriends[currIndex]]['phone'];
                console.log(toShow);
                return toShow;
            }
            return null;
        }
    };
};
