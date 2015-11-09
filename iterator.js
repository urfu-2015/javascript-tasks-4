'use strict';


module.exports.get = function (collection, startPoint, depth) {
    var friends = [];
    if (depth === 0) {
        return {
            next: function () {
                return null
            },
            prev: function () {
                return null
            },
            nextMale: function () {
                return null
            },
            prevMale: function () {
                return null
            }
        }
    }
    if (startPoint && collection.hasOwnProperty(startPoint)) {
        friends = [startPoint];
        var friendsOfFriends;

        friendsOfFriends = getFriends(collection, friends, friends);
        friends = merge(friends, friendsOfFriends);
        depth -= 1;
        while ((!depth && friendsOfFriends.length !== 0) ||(depth && depth > 0)){
            friendsOfFriends = getFriends(collection, friendsOfFriends, friends);
            friends = merge(friends, friendsOfFriends);
            depth -= 1;
        }
    }
    return {
        faceBook: collection,
        friendList: friends,
        index: 0,
        indexMale: 0,
        next: function (name) {
            if (!this.friendList) {
                return null;
            }
            if (name && typeof name === 'string') {
                return {
                    name: name,
                    phone: this.faceBook[name].phone
                };
            }
            if (this.index < this.friendList.length && this.index >= 0) {
                this.index ++;
                var person = {};
                person['name'] = this.friendList[this.index - 1];
                person['phone'] = this.faceBook[this.friendList[this.index - 1]].phone;
                return person;
            } else {
                return null;
            }
        },
        prev: function () {
            if (this.index <= this.friendList.length && this.index > 0) {
                this.index --;
                var person = {};
                person['name'] = this.friendList[this.index];
                person['phone'] = this.faceBook[this.friendList[this.index]].phone;
                return person;
            } else {
                return null;
            }
        },
        prevMale: function () {
            if (this.indexMale < this.friendList.length && this.indexMale >= 0) {
                this.indexMale --;
                while (this.indexMale < this.friendList.length && this.indexMale >= 0 &&
                this.faceBook[this.friendList[this.indexMale]].gender !== 'Мужской') {
                    this.indexMale --;
                }
                if (this.indexMale < this.friendList.length && this.indexMale >= 0) {
                    var person = {};
                    person['name'] = this.friendList[this.indexMale];
                    person['phone'] = this.faceBook[this.friendList[this.indexMale]].phone;
                    return person;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        nextMale: function (name) {
            if (name && typeof name === 'string' && this.faceBook[name]) {
                return {
                    name: name,
                    phone: this.faceBook[name].phone
                };
            }
            if (this.indexMale < this.friendList.length && this.indexMale >= 0) {
                while (this.indexMale < this.friendList.length && this.indexMale >= 0 &&
                this.faceBook[this.friendList[this.indexMale]].gender !== 'Мужской') {
                    this.indexMale ++;
                }
                this.indexMale ++;
                if (this.indexMale < this.friendList.length && this.indexMale >= 0) {
                    var person = {};
                    person['name'] = this.friendList[this.indexMale - 1];
                    person['phone'] = this.faceBook[this.friendList[this.indexMale - 1]].phone;
                    return person;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    };
};

function getFriends(collection, friends, invited) {
    var result = [];
    for (var i = 0; i < friends.length; i++) {
        var personsFriends = collection[friends[i]].friends.slice().sort();
        result = result.concat(personsFriends);
    }
    return uniq(result, invited);
}

function merge(collect1, collect2) {
    var result = collect1.slice();
    for (var i = 0; i < collect2.length; i++) {
        if (result.indexOf(collect2[i]) === -1) {
            result.push(collect2[i]);
        }
    }
    return result;
}

function uniq(collection, filter) {
    var result = [];
    for (var i = 0; i < collection.length; i++) {
        if (result.indexOf(collection[i]) === -1 && filter.indexOf(collection[i]) === -1) {
            result.push(collection[i]);
        }
    }
    return result;
}
