'use strict';


module.exports.get = function (collection, startPoint, depth) {
    var friends = [];
    if (depth === 0) {
        return {
            next: function () {
                return null;
            },
            prev: function () {
                return null;
            },
            nextMale: function () {
                return null;
            },
            prevMale: function () {
                return null;
            }
        };
    }
    if (startPoint && collection.hasOwnProperty(startPoint)) {
        friends = [startPoint];
        var friendsOfFriends;
        friendsOfFriends = getFriends(collection, friends, friends);
        friends = merge(friends, friendsOfFriends);
        depth -= 1;
        while ((isNaN(depth) && friendsOfFriends.length !== 0) || (!isNaN(depth) && depth > 0)) {
            friendsOfFriends = getFriends(collection, friendsOfFriends, friends);
            friends = merge(friends, friendsOfFriends);
            depth -= 1;
        }
    }
    return {
        faceBook: collection,
        friendList: friends,
        index: 1,
        current: friends[0],
        indexMale: 1,
        currentMale: friends[0],
        next: function (name) {
            if (this.friendList.length <= 0) {
                return null;
            }
            if (name && typeof name === 'string') {
                if (this.friendList.indexOf(name) !== -1) {
                    var person = {};
                    person['name'] = name;
                    person['phone'] = this.faceBook[name].phone;
                    return person;
                } else {
                    return null;
                }
            }
            var currentIndex = this.friendList.indexOf(this.current);
            if (currentIndex + 1 < this.friendList.length && currentIndex + 1 >= 0) {
                person = {};
                this.current = this.friendList[currentIndex + 1];
                person['name'] = this.current;
                person['phone'] = this.faceBook[this.current].phone;
                return person;
            } else {
                return null;
            }
        },
        prev: function () {
            var currentIndex = this.friendList.indexOf(this.current);
            if (currentIndex - 1 <= this.friendList.length && currentIndex - 1 >= 0) {
                var person = {};
                this.current = this.friendList[currentIndex - 1];
                person['name'] = this.current;
                person['phone'] = this.faceBook[this.current].phone;
                return person;
            } else {
                return null;
            }
        },
        prevMale: function () {
            this.index --;
            var currentIndex = this.friendList.indexOf(this.currentMale);
            if (currentIndex - 1 < this.friendList.length && currentIndex - 1 >= 0) {
                currentIndex --;
                while (currentIndex - 1 < this.friendList.length && currentIndex - 1 >= 0 &&
                this.faceBook[this.friendList[currentIndex]].gender !== 'Мужской') {
                    currentIndex --;
                }
                if (this.faceBook[this.friendList[currentIndex]].gender === 'Мужской') {
                    var person = {};
                    this.currentMale = this.friendList[currentIndex];
                    person['name'] = this.currentMale;
                    person['phone'] = this.faceBook[this.currentMale].phone;
                    return person;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        nextMale: function (name) {
            if (name && typeof name === 'string' && this.friendList.indexOf(name) !== -1) {
                var person = {};
                person['name'] = name;
                person['phone'] = this.faceBook[name].phone;
                return person;
            }
            var currentIndex = this.friendList.indexOf(this.currentMale);
            if (currentIndex + 1 < this.friendList.length && currentIndex + 1 >= 0) {
                currentIndex ++;
                while (currentIndex + 1 < this.friendList.length && currentIndex + 1 >= 0 &&
                this.faceBook[this.friendList[currentIndex]].gender !== 'Мужской') {
                    currentIndex ++;
                }
                if (this.faceBook[this.friendList[currentIndex]].gender === 'Мужской') {
                    person = {};
                    this.currentMale = this.friendList[currentIndex];
                    person['name'] = this.currentMale;
                    person['phone'] = this.faceBook[this.currentMale].phone;
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
