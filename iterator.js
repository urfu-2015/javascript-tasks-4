'use strict';

function newJSON(collection, friendName) {
    return {
        name: friendName,
        phone: collection[friendName]['phone']
    }
}

function addToFriendsList(collection, friendsList, startPoint) {
    var friendsToAdd = [];
    for (var i in friendsList) {
        var candidates = collection[friendsList[i]]['friends'].sort();
        for (var j in friendsList) {
            if (friendsList.indexOf(candidates[j]) === -1 && candidates[j] !== startPoint) {
                friendsToAdd.push(candidates[j]);
            }
        }
    }
    if (friendsToAdd.length !== 0) {
        return friendsToAdd;
    } else {
        return null;
    }
}

module.exports.get = function (collection, startPoint, depth) {
    return {
        friendsList: collection[startPoint]['friends'].sort(),
        iterationIndex: -1,
        numOfAdditions: 0,
        next: function() {
            this.iterationIndex += 1;
            if (this.iterationIndex === this.friendsList.length) {
                return null;
            }
            var addedList = addToFriendsList(collection, this.friendsList, startPoint);
            if (addedList) {
                this.friendsList = this.friendsList.concat(addedList);
                this.numOfAdditions += 1;
            }
            return newJSON(collection, this.friendsList[this.iterationIndex]);
        },
        nextMale: function() {
            this.iterationIndex += 1;
            while (this.iterationIndex < this.friendsList.length) {
                if (collection[this.friendsList[this.iterationIndex]]['gender'] !== 'Мужской') {
                    this.iterationIndex += 1;
                } else {
                    break;
                }
            }
            var addedList = addToFriendsList(collection, this.friendsList, startPoint);
            if (addedList) {
                this.friendsList = this.friendsList.concat(addedList);
                this.numOfAdditions += 1;
            }

            if (this.iterationIndex >= this.friendsList.length) {
                return null;
            }

            return newJSON(collection, this.friendsList[this.iterationIndex]);
        },
        prev: function() {
            this.iterationIndex -= 1;
            if (this.iterationIndex < 0) {
                return null;
            }
            return newJSON(collection, this.friendsList[this.iterationIndex]);
        },
        prevMale: function() {
            while (this.iterationIndex > 0) {
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
    }
};
