'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var result = [null];
    var badVar;
    var currentFriendIndex = 0;
    if (depth === undefined) {
        depth = Infinity;
    }
    if (!(startPoint in collection)) {
        badVar = false;
    } else {
        var queue = [];
        var used = [];
        var d = {};
        for (var el in collection) {
            d[el] = 0;
        }
        queue.push(startPoint);
        used.push(startPoint);
        main: while (queue.length != 0) {
            var currentFriend = queue.shift();
            for (var i = 0; i < collection[currentFriend].friends.sort().length; i++) {
                var hisFriend = collection[currentFriend].friends[i];
                if (used.indexOf(hisFriend) == -1) {
                    d[hisFriend] = d[currentFriend] + 1;
                    if (d[hisFriend] > depth) {
                        break main;
                    }
                    used.push(hisFriend);
                    queue.push(hisFriend);
                    result.push(getOutput(hisFriend));
                }
            }
        }
    }
    console.log(result);

    function getNext(name) {
        if (!badVar) {
            currentFriendIndex++;
            if (currentFriendIndex < result.length) {
                if (name !== undefined) {
                    while (result[currentFriendIndex].name != name) {
                        currentFriendIndex++;
                    }
                }
                return result[currentFriendIndex];
            } else {
                currentFriendIndex = result.length;
                return null;
            }
        } else {
            return null;
        }
    };

    function getPrev() {
        currentFriendIndex--;
        if (currentFriendIndex <= 0) {
            currentFriendIndex = 1;
            return null;
        } else {
            return result[currentFriendIndex];
        }
    };

    function getOutput(name) {
        var temp_result = {};
        temp_result['name'] = name;
        temp_result['phone'] = collection[name]['phone'];
        return temp_result;
    };

    function getNextMale() {
        currentFriendIndex++;
        if (currentFriendIndex < result.length) {
            while (collection[result[currentFriendIndex]['name']].gender != 'Мужской') {
                currentFriendIndex++;
            }
            return result[currentFriendIndex];
        } else {
            currentFriendIndex = result.length;
            return null;
        }
    };

    function getPrevMale() {
        currentFriendIndex--;
        if (currentFriendIndex <= 0) {
            currentFriendIndex = 1;
            return null;
        } else {
            while (collection[result[currentFriendIndex]['name']].gender != 'Мужской') {
                currentFriendIndex--;
            }
            console.log(currentFriendIndex);
            return result[currentFriendIndex];
        }
    };

    return {
        next: getNext,
        prev: getPrev,
        nextMale: getNextMale,
        prevMale: getPrevMale
    };
};
