'use strict';

function getFriends(collection, startPoint, depth) {
    Object.keys(collection).forEach(function (name) {
        collection[name].friends.sort(function (a, b) {
            return a > b ? 1 : -1;
        });
    });
    if (depth === undefined) {
        depth = Object.keys(collection).length;
    }
    if (collection[startPoint] === undefined) {
        return [];
    } else {
        var depthOfFriends = [[startPoint]];
        var currentDepth = 0;
        var visited = [startPoint];
        while (currentDepth < depth) {
            var people = [];
            depthOfFriends[currentDepth].map(function (somebody) {
                collection[somebody].friends.map(function (guys) {
                    if (visited.indexOf(guys) === -1 && collection[guys] !== undefined) {
                        people.push(guys);
                        visited.push(guys);
                    }
                });
            });
            depthOfFriends[currentDepth + 1] = people;
            currentDepth++;
        }
        return flattened(depthOfFriends);
    }
}

function flattened(oldArray) {
    return oldArray.reduce(function (a, b) {
        return a.concat(b);
    });
}

module.exports.get = function (collection, startPoint, depth) {
    var allFriends = getFriends(collection, startPoint, depth);
    //console.log(allFriends);
    var maxNumOfFriend = allFriends.length;
    var currentFriend = 1;
    return {
        next: function (name) {
            if (collection[startPoint] === undefined || currentFriend >= maxNumOfFriend - 1) {
                return null;
            }
            if (name !== undefined) {
                while (true) {
                    var friend = allFriends[currentFriend];
                    if (currentFriend >= maxNumOfFriend - 1) {
                        return null;
                    }
                    if (friend === name) {
                        currentFriend++;
                        /*console.log('--');
                        console.log({
                            name: friend,
                            phone: collection[friend].phone
                        });
                        return {
                            name: friend,
                            phone: collection[friend].phone
                        };*/
                        return collection[friend];
                    }
                    currentFriend++;
                }
            } else {
                var friend = allFriends[currentFriend];
                currentFriend++;
                /*console.log('--');
                console.log({
                            name: friend,
                            phone: collection[friend].phone
                        });
                return {
                            name: friend,
                            phone: collection[friend].phone
                        };*/
                return collection[friend];
            }
        },
        prev: function () {
            if (collection[startPoint] === undefined || currentFriend < 2) {
                return null;
            }
            var friend = allFriends[currentFriend - 2];
            currentFriend--;
            /*return {
                            name: friend,
                            phone: collection[friend].phone
                        };*/
            return collection[friend];
        },
        nextMale: function () {
            if (collection[startPoint] === undefined || currentFriend >= maxNumOfFriend - 1) {
                return null;
            }
            while (true) {
                var friend = allFriends[currentFriend];
                if (collection[friend].gender === 'Мужской') {
                    currentFriend++;
                    return {
                        name: friend,
                        phone: collection[friend].phone
                    };
                }
                currentFriend++;
            }
        },
        prevMale: function () {
            if (collection[startPoint] === undefined || currentFriend < 2) {
                return null;
            }
            while (true) {
                var friend = allFriends[currentFriend - 2];
                if (collection[friend].gender === 'Мужской') {
                    currentFriend--;
                    return {
                            name: friend,
                            phone: collection[friend].phone
                        };
                }
                currentFriend--;
            }
        }
    };
};
