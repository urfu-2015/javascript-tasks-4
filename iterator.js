'use strict';


module.exports.get = function (collection, startPoint, depth) {
    var friends;
    if (startPoint) {
        friends = (collection[startPoint].friends).sort();
        var friendsOfFriends;
        if (depth) {
            friendsOfFriends = getFriends(collection, friends);
            friends = merge(friends, friendsOfFriends);
            if (depth > 2){
                for(var i = 0; i < depth - 2; i++){
                    friendsOfFriends = getFriends(collection, friendsOfFriends);
                    friends = merge(friends, friendsOfFriends);
                }
            }
        } else {
            friendsOfFriends = getFriends(collection, friends);
            friends = merge(friends, friendsOfFriends);
            do{
                friendsOfFriends = getFriends(collection, friendsOfFriends);
                friends = merge(friends, friendsOfFriends);
            } while(friendsOfFriends)
        }
    } else {
        friends = []
    }
    console.log(friends);
    return friends;
};

function getFriends(collection, friends, invited) {
    var result = [];
    for (var i = 0; i < friends.length; i++) {
        var personsFriends = collection[friends[i]].friends.slice().sort();
        console.log(result, personsFriends);
        result = result.concat(personsFriends);
    }
    return uniq(result);
}

function merge(collect1, collect2){
    var result = collect1.slice();
    for (var i = 0; i < collect2.length; i++){
        if (result.indexOf(collect2[i]) === -1) {
            result.push(collect2[i]);
        }
    }
    return result;
}

function uniq(collection) {
    var result = [];
    for (var i = 0; i < collection.length; i++) {
        if (result.indexOf(collection[i])) {
            result.push(collection[i])
        }
    }
    return result;
}

