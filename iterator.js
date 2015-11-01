'use strict';

module.exports.get = function (phoneBook, startPosition, depthFind) {
    if (phoneBook[startPosition] === undefined) {
        return {
            next: null,
            prev: null
        };
    };
    if (depthFind === undefined) {
        depthFind = 0;
    };
    var friends = findFriends(phoneBook, startPosition, depthFind);
    return {

        curIndex: 0,
        next: function () {
            if (this.curIndex === friends.length) {
                return null;
            } else {
                this.curIndex++;
                var resFriend = friends[this.curIndex];
                return resFriend;
            }
        },
        prev: function () {
            if (this.curIndex === 0) {
                return null;
            } else {
                this.curIndex--;
                var resFriend = friends[this.curIndex];
                return resFriend;
            }
        }
    };
};
function findFriends(phoneBook, startPosition, depthFind) {
    var queue = [[startPosition, 0]];
    var friendsNames = [startPosition];
    var friends = [];
    var depth = 0;
    var fname = '';
    var fFriends = [];
    while (queue.length > 0 && depth < depthFind) {
        var current = queue.shift();
        fname = current[0];
        depth = current[1];
        friends.push({
            name: fname,
            phone: phoneBook[fname].phone
        });
        friendsNames.push(fname);
        fFriends = phoneBook[fname].friends;
        for (var i = 0; i < fFriends.length; i++) {
            if (friendsNames.indexOf(fFriends[i]) < 0) {
                queue.push([fFriends[i], depth + 1]);
            };
        };
    };
    return friends;
}

