'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (collection[startPoint] === undefined) {
        var nullFunc = function () {
            return null;
        };
        return {
            next: nullFunc,
            prev: nullFunc,
            nextMale: nullFunc
        };
    }
    if (depth === undefined) {
        depth = Infinity;
    }
    var friends = getFriends(collection, startPoint, depth);
    return {
        friendsList: friends,
        currentIndex: 0,
        next: function (name) {
            if (this.currentIndex === this.friendsList.length - 1) {
                return null;
            }
            if (name === undefined) {
                this.currentIndex++;
                return this.friendsList[this.currentIndex];
            } else {
                while (this.currentIndex < this.friendsList.length - 1) {
                    this.currentIndex++;
                    var currentFriend = this.friendsList[this.currentIndex];
                    if (currentFriend.name == name) {
                        return currentFriend;
                    }
                }
                return null;
            }
        },
        prev: function () {
            if (this.currentIndex === 0) {
                return null;
            }
            this.currentIndex--;
            return this.friendsList[this.currentIndex];
        },
        nextMale: function () {
            if (this.currentIndex === this.friendsList.length - 1) {
                return null;
            }
            while (this.currentIndex < this.friendsList.length - 1) {
                this.currentIndex++;
                var currentFriend = this.friendsList[this.currentIndex];
                if (collection[currentFriend.name].gender === 'Мужской') {
                    return currentFriend;
                }
            }
            return null;
        }
    };
};

function getFriends(collection, startPoint, depth) {
    //Powered by BFS
    var friendNames = [startPoint];
    var friends = [];
    var queue = [[startPoint, 0]];
    while (queue.length > 0) {
        var current = queue.shift();
        var currentFriendName = current[0];
        var currentDepth = current[1];
        friends.push({
            name: currentFriendName,
            phone: collection[currentFriendName].phone
        });
        if (currentDepth === depth) {
            continue;
        }
        var currentFriends = collection[currentFriendName].friends.sort();
        for (var i = 0; i < currentFriends.length; i++) {
            if (friendNames.indexOf(currentFriends[i]) < 0) {
                queue.push([currentFriends[i], currentDepth + 1]);
                friendNames.push(currentFriends[i]);
            }
        }
    }
    return friends;
}
