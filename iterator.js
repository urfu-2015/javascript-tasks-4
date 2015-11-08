'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var iterator = {count: 0, collection: [], started: true};
    var stackFriends = [];
    var visited = [startPoint];

    if (Object.keys(collection).indexOf(startPoint) == -1) {
        iterator.started = false;
    } else {
        stackFriends.push({name: startPoint, depth: 0});

        while (stackFriends.length > 0 && visited.length < Object.keys(collection).length) {
            var current = stackFriends.shift();

            if (depth && current.depth > depth) {
                break;
            }

            var note = collection[current.name];
            note.name = current.name;
            iterator.collection.push(note);
            var currentFriends = collection[current.name].friends.sort();
            for (var i = 0; i < currentFriends.length; i++) {
                if (collection[currentFriends[i]] &&
                    visited.indexOf(currentFriends[i]) === -1) {
                    stackFriends.push({name: currentFriends[i], depth: current.depth + 1});
                    visited.push(currentFriends[i]);
                }
            }
        }
    }

    iterator.refresh = function (currentFriend) {
        var newIterator = module.exports.get(collection, startPoint, depth);
        newIterator.next(currentFriend);
        return newIterator;
    };

    iterator.next = function () {
        if (!this.started) {
            return null;
        }

        this.count = this.count + 1;

        if (arguments[0]) {
            while (this.count < this.collection.length &&
                (this.collection[this.count].name !== arguments[0] &&
                this.collection[this.count].gender !== arguments[0])) {
                this.count++;
            }
        }

        if (this.count > this.collection.length) {
            this.count = this.collection.length;
        }

        if ((this.count < 0) || (this.count >= this.collection.length)) {
            return null;
        }

        return {name: this.collection[this.count].name, phone: this.collection[this.count].phone};
        //console.log("name:" + this.collection[this.count].name + ", " +
        //    "phone:" + this.collection[this.count].phone);
    };

    iterator.prev = function () {
        if (!this.started) {
            return null;
        }

        this.count--;

        if (arguments[0]) {
            while (this.count > 0 && (this.collection[this.count].name !== arguments[0] &&
                this.collection[this.count].gender !== arguments[0])) {
                this.count--;
            }
        }

        if (this.count < -1) {
            this.count = -1;
        }

        if ((this.count < 0) || (this.count >= this.collection.length)) {
            return null;
        }

        return {name: this.collection[this.count].name, phone: this.collection[this.count].phone};
        //console.log("name:" + this.collection[this.count].name + ", " +
        //     "phone:" + this.collection[this.count].phone);
    };

    iterator.nextMale = function () {
        return this.next('Мужской');
    };

    iterator.prevMale = function () {
        return this.prev('Мужской');
    };

    return iterator;
};
