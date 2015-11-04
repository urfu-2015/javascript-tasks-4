'use strict';
module.exports.get = function (collection, startPoint, depth) {
    var friendsArray = getFriends(collection, startPoint, depth);
    return {
        currentFriend: -1,
        next: function (name) {
            if (friendsArray[this.currentFriend + 1] === undefined) {
                return null;
            }
            this.currentFriend++;
            if (!name) {
                return this.current();
            }
            var index = 0;
            friendsArray.forEach(function (item) {
                if (item == name) {
                    index = friendsArray.indexOf(item);
                }
            });
            this.currentFriend = index;
            return this.current();
        },
        nextMale: function (name) {
            if (startPoint === undefined) {
                return null;
            }
            if (friendsArray[this.currentFriend + 1] === undefined) {
                return null;
            }
            var currentfriend = this.next(name);
            while (collection[currentfriend.name]) {
                if (collection[currentfriend.name]['gender'] === 'Мужской') {
                    return currentfriend;
                }
                return this.next(name);
            }
        },
        prevMale: function (name) {
            if (startPoint === undefined) {
                return null;
            }
            if (friendsArray[this.currentFriend + 1] === undefined) {
                return null;
            }
            var currentfriend = this.prev();
            while (collection[currentfriend.name]) {
                if (collection[currentfriend.name]['gender'] === 'Мужской') {
                    return currentfriend;
                }
                return this.prev();
            }
        },
        prev: function () {
            if (startPoint === undefined) {
                return null;
            }
            if (friendsArray[this.currentFriend - 1] === undefined) {
                return null;
            }
            this.currentFriend --;
            return this.current();
        },
        current: function() {
            var friend = friendsArray[this.currentFriend]
            return {name: friend['name'], phone: friend['phone'] };
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
        depth = Object.keys(collection).length - 1;
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
    var names = [startPoint];
    
    for (var i = 0; i < friends.length; i++) {
        for (var j = 0; j < friends[i].length; j++) {
            if (!singleName(friends[i][j])) {
                //var friend = { name: }
                result.push(friends[i][j]);
                names.push(friends[i][j]);
            }
        }
    }
    return result.map(function (elem) {
        var data = collection[elem];
        data['name'] = elem;
        return data;
    });
}

