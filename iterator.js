'use strict';

function newJSON(collection, friendName) {
    return {
        name: friendName,
        phone: collection[friendName]['phone']
    };
}

function addToFriendsList(collection, friendsList, startPoint) {
    var friendsToAdd = [];
    for (var i in friendsList) {
        var candidates = collection[friendsList[i]]['friends'].sort();
        for (var j in candidates) {
            if (friendsList.indexOf(candidates[j]) === -1 && candidates[j] !== startPoint) {
                friendsToAdd.push(candidates[j]);
            }
        }
    }
    if (!friendsToAdd.length) {
        return friendsList;
    }
    return null;
}

function initializeList(collection, startPoint) {
    if (typeof startPoint === 'undefined' || Object.keys(collection).indexOf(startPoint) === -1) {
        return null;
    }
    return collection[startPoint]['friends'].sort();
}

module.exports.get = function (collection, startPoint, depth) {
    return {
        usersList: Object.keys(collection),
        friendsList: initializeList(collection, startPoint),
        iterationIndex: -1,
        numOfAdditions: 1,
        depth: depth || Infinity,
        next: function (friend) {
            if (Object.keys(collection).indexOf(startPoint) === -1) {
                return null;
            }
            this.iterationIndex += 1;
            if (typeof friend !== 'undefined') {
                for (var i = this.iterationIndex; i < this.friendsList.length; i++) {
                    if (this.friendsList[i] === friend) {
                        return newJSON(collection, this.friendsList[i]);
                    }
                    this.iterationIndex += 1;
                }
            }
            if (this.iterationIndex >= this.friendsList.length) {
                return null;
            }

            var addedList = addToFriendsList(collection, this.friendsList, startPoint);
            if (addedList && this.numOfAdditions < this.depth) {
                this.friendsList = this.friendsList.concat(addedList);
                this.numOfAdditions += 1;
            }
            return newJSON(collection, this.friendsList[this.iterationIndex]);
        },
        nextMale: function () {
            this.iterationIndex += 1;
            while (this.iterationIndex < this.friendsList.length) {
                if (collection[this.friendsList[this.iterationIndex]]['gender'] !== 'Мужской') {
                    this.iterationIndex += 1;
                } else {
                    break;
                }
            }
            var addedList = addToFriendsList(collection, this.friendsList, startPoint);
            if (addedList && this.numOfAdditions < this.depth) {
                this.friendsList = this.friendsList.concat(addedList);
                this.numOfAdditions += 1;
            }
            if (this.iterationIndex >= this.friendsList.length) {
                return null;
            }

            return newJSON(collection, this.friendsList[this.iterationIndex]);
        },
        prev: function (friend) {
            if (Object.keys(collection).indexOf(startPoint) === -1) {
                return null;
            }
            this.iterationIndex -= 1;
            if (typeof friend !== 'undefined') {
                for (var i = this.iterationIndex; i >= 0; i--) {
                    if (this.friendsList[i] === friend) {
                        return newJSON(collection, this.friendsList[i]);
                    }
                    this.iterationIndex -= 1;
                }
            }
            if (this.iterationIndex < 0) {
                return null;
            }
            return newJSON(collection, this.friendsList[this.iterationIndex]);
        },
        prevMale: function () {
            this.iterationIndex -= 1;
            while (this.iterationIndex >= 0) {
                if (collection[this.friendsList[this.iterationIndex]]['gender'] !== 'Мужской') {
                    this.iterationIndex -= 1;
                } else {
                    break;
                }
            }
            if (this.iterationIndex < 0) {
                return null;
            }
            return newJSON(collection, this.friendsList[this.iterationIndex]);
        }
    };
};
