'use strict';
module.exports.get = function (collection, startPoint, depth) {
    var friendsArray = getFriends(collection, startPoint, depth);
    return {
        currentFriend: 0,
        next: function (name) {
            if (this.currentFriend >= friendsArray.length) {
                return null;
            }
            if (friendsArray[this.currentFriend] === undefined) {
                return null;
            }
            if (name === undefined) {
                var friend = friendsArray[this.currentFriend];
                this.currentFriend++;
                return { name: friend, phone: collection[friend].phone};
            } else {
                var friend = friendsArray[this.currentFriend];
                this.currentFriend++;
                return { name: friend, phone: collection[friend].phone};
            }
        },
        nextMale: function (name) {
            if (startPoint === undefined) {
                return null;
            }
            if (this.currentFriend >= friendsArray.length) {
                return null;
            }
            if (friendsArray[this.currentFriend] === undefined) {
                return null;
            }
            if (name === undefined) {
                while (collection[friendsArray[this.currentFriend]]['gender'] != 'Мужской') {
                    this.currentFriend++;
                }
                var friend = friendsArray[this.currentFriend];
                this.currentFriend++;
                return { name: friend, phone: collection[friend].phone};
            }
        },
        prevMale: function (name) {
            if (startPoint === undefined) {
                return null;
            }
            if (this.currentFriend <= 0) {
                return null;
            }
            if (friendsArray[this.currentFriend] === undefined) {
                return null;
            }
            if (name === undefined) {
                this.currentFriend--;
                while (collection[friendsArray[this.currentFriend]]['gender'] != 'Мужской') {
                    this.currentFriend--;
                }
                var friend = friendsArray[this.currentFriend];
                this.currentFriend--;
                return { name: friend, phone: collection[friend].phone};
            }
        },
        prev: function (name) {
            if (this.currentFriend <= 0) {
                return null;
            }
            if (startPoint === undefined) {
                return null;
            }
            if (friendsArray[this.currentFriend] === undefined) {
                return null;
            }
            if (name === undefined) {
                this.currentFriend -= 2;
                var friend = friendsArray[this.currentFriend];
                return { name: friend, phone: collection[friend].phone};
            } else {
                var friend = friendsArray[this.currentFriend];
                this.currentFriend -= 2;
                return { name: friend, phone: collection[friend].phone};
            }
        }
    };
};
function getFriends(collection, startPoint, depth) {
    if (depth === undefined) {
        depth = Object.keys(collection).length - 1;
    }
    if (collection[startPoint] === undefined) {
        return [];
    }
    if (depth > Object.keys(collection).length) {
        return [];
    }
    var friends = [];
    var names = [startPoint];
    friends.push(collection[startPoint]['friends']);
    function singleName(name) {
        var flag = false;
        for (var k = 0; k < names.length; k++) {
            if (name == names[k]) {
                flag = true;
            }
        }
        return flag;
    }
    function getFriend(name) {
        if (!singleName(name)) {
            friends.push(collection[name]['friends'].sort());
            names.push(name);
        }
        return names;
    }
    for (var i = 0; i < depth - 1; i++) {
        for (var j = 0; j < friends[i].length; j++) {
            getFriend(friends[i][j]);
        }
    }
    var result = [];
    var names = ['Сергей'];
    for (var i = 0; i < friends.length; i++) {
        for (var j = 0; j < friends[i].length; j++) {
            if (!singleName(friends[i][j])) {
                result.push(friends[i][j]);
                names.push(friends[i][j]);
            }
        }
    }
    return result;
}
function getFriendForOut(faceBook, friendName) {
    var input = {name: friendName,
    phone: faceBook[friendName]['phone']};
    console.log(input);
}
