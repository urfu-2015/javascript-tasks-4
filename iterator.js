'use strict';

module.exports.get = function (collection, startPoint, depth) {
    return {
        friends: createFriendList(collection, startPoint, depth),
        indexPointer: -1,

        next: function (name) {
            if (name == undefined) {
                if (this.indexPointer < this.friends.length - 1) {
                    this.indexPointer += 1;
                    return {name: this.friends[this.indexPointer],
                        phone: collection[this.friends[this.indexPointer]].phone};
                } else {
                    return null;
                }
            } else {
                return getFriend(collection, this.friends, name);
            }
        },

        prev: function (name) {
            if (name == undefined) {
                if (this.indexPointer > 0) {
                    this.indexPointer -= 1;
                    return {name: this.friends[this.indexPointer],
                        phone: collection[this.friends[this.indexPointer]].phone};
                } else {
                    return null;
                }
            } else {
                return getFriend(collection, this.friends, name);
            }
        },

        nextMale: function (name) {
            if (name == undefined) {
                this.indexPointer += 1;
                var len = this.friends.length;
                while (this.indexPointer < len) {
                    if (collection[this.friends[this.indexPointer]].gender == 'Мужской') {
                        return {name: this.friends[this.indexPointer],
                            phone: collection[this.friends[this.indexPointer]].phone};
                    } else {
                        this.indexPointer += 1;
                    }
                }
                return null;
            } else {
                return getFriend(collection, this.friends, name);
            }
        },

        prevMale: function (name) {
            if (name == undefined) {
                this.indexPointer -= 1;
                while (this.indexPointer >= 0) {
                    if (collection[this.friends[this.indexPointer]].gender == 'Мужской') {
                        return {
                            name: this.friends[this.indexPointer],
                            phone: collection[this.friends[this.indexPointer]].phone
                        };
                    } else {
                        this.indexPointer -= 1;
                    }
                }
                return null;
            } else {
                return getFriend(collection, this.friends, name);
            }
        }
    };
};


function getFriend(collection, friends, name) {
    if (friends.indexOf(name) >= 0) {
        return {name: name, phone: collection[name].phone};
    } else {
        return null;
    }
}

function createFriendList(collection, startPoint, depth) {
    function getFriends(friends, currentDepth) {
        var newFriends = [];
        friends.forEach(function (friend) {
            newFriends = newFriends.concat(collection[friend].friends.filter(function (friend) {
                return friendList.indexOf(friend) < 0;
            }).sort());
        });
        friendList = friendList.concat(newFriends);
        if (currentDepth < depth - 1 && newFriends.length != 0) {
            getFriends(newFriends, currentDepth + 1);
        }
    }

    if (startPoint in collection && depth != 0) {
        depth = depth || Object.keys(collection).length;
        var friendList = [startPoint];
        getFriends([startPoint], 0);
        return friendList.slice(1);
    } else {
        return [];
    }
}
