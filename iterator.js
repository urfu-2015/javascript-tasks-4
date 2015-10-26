'use strict';

function getFriends(collection, startPoint, depth) {
    if (collection[startPoint] === undefined) {
        return [];
    } else {

    var depthOfFriends = [[startPoint]] ;
    var currentDepth = 0;
    var visited = [startPoint];
    while (currentDepth < depth) {
        var people = [];
        var l = depthOfFriends[currentDepth].length;
        for (var i = 0; i < l; i++) {
            var numOfFriends = collection[depthOfFriends[currentDepth][i]].friends.length;
            for (var j = 0; j < numOfFriends; j++) {
                var currentFriend = collection[depthOfFriends[currentDepth][i]].friends[j];
                if (visited.indexOf(currentFriend) = -1 && collection.indexOf(currentFriend) > -1) {
                    people.push(currentFriend);
                    }
                }
                people = people.sort;
                depthOfFriends[currentDepth] = depthOfFriends[currentDepth].concat(people);
                visited = visited.concat(people);
            }
            currentDepth++;
        }
        return (depthOfFriends);
    }
}

module.exports.get = function (collection, startPoint, depth) {
    
    if (depth === undefined) {
        depth = collection.length;
    }

    var allFriends = getFriends(collection, startPoint, depth);
    var currentDepth = 0;
    var currentFriends = 0;

return{
     next: function(name) {
        if (allFriends === []) {
            return (null);
        } else {
            if (name === undefined) {
                currentFriends = currentFriends++;
                if (currentFriends > [allFriends[currentDepth]].length) {
                    currentDepth = currentDepth++;
                    if (currentDepth <= depth) {
                        currentFriends = 0;
                        return {
                            name: allFriends[currentDepth][currentFriends],
                            phone: collection[allFriends[currentDepth][currentFriends]].phone
                        };
                    } else {
                        return null;
                    }
                } else {
                return {
                            name: [allFriends[currentDepth]][currentFriends],
                            phone: collection[allFriends[currentDepth][currentFriends]].phone
                        }
                }
            } else {
            return {
                            name: name,
                            phone: collection[name].phone
                        }
            }
        }
    },

    /*function nextMale(name) {
        
    }*/
     pref: function(name) {
        if (allFriends === []) {
            return (null);
        } else {
            if (name === undefined) {
                currentFriends = currentFriends--;
                if (currentFriends < 0) {
                    currentDepth = currentDepth--;
                    if (currentDepth < 0) {
                    return (null)} else {
                        return {
                            name: allFriends[currentDepth][currentFriends],
                            phone: collection[allFriends[currentDepth][currentFriends]].phone
                        }
                    }
                } else {
                return {
                            name: allFriends[currentDepth][currentFriends],
                            phone: collection[allFriends[currentDepth][currentFriends]].phone
                        }
                }
                
            } else {
            return {
                            name: allFriends[currentDepth][currentFriends],
                            phone: collection[allFriends[currentDepth][currentFriends]].phone
                        }
            }
        }
    }
    /*function prefMale(name) {
        
    }*/
}
}

