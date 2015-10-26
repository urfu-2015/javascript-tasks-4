'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var iterator = {count: -1, collection: [], hasStart: true};
    var visited = [];
    var stack = [];
    if (Object.keys(collection).indexOf(startPoint) == -1) {
        iterator.hasStart = false;
    } else {
        stack.push({name: startPoint, depth: 0});
        while (visited.length < Object.keys(collection).length) {
            var current = stack.shift();
            if (current.depth >= depth) {
                break;
            }
            if (current.name !== startPoint) {
                var record = collection[current.name];
                record.name = current.name;
                iterator.collection.push(record);
            }
            visited.push(current.name);
            var currentFriends = collection[current.name].friends.sort();
            for (var friend = 0; friend < currentFriends.length; friend++) {
                if (visited.indexOf(currentFriends[friend]) === -1) {
                    stack.push({name: currentFriends[friend], depth: current.depth + 1});
                }
            }
        }
    }

    iterator.next = function () {
        if (!this.hasStart) {
            return null;
        }
        this.count = this.count + 1;
        if (arguments[0]) {
            while (this.count < this.collection.length &&
                this.collection[this.count].name !== arguments[0]) {
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
    };

    iterator.prev = function () {
        if (!this.hasStart) {
            return null;
        }
        this.count--;
        if (arguments[0]) {
            while (this.count > 0 && this.collection[this.count].name !== arguments[0]) {
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
    };

    iterator.nextMale = function () {
        if (!this.hasStart) {
            return null;
        }
        this.count++;
        while (this.count < this.collection.length &&
            this.collection[this.count].gender !== 'Мужской') {
            this.count++;
        }
        if (this.count > this.collection.length) {
            this.count = this.collection.length;
        }
        if ((this.count < 0) || (this.count >= this.collection.length)) {
            return null;
        }
        return {name: this.collection[this.count].name, phone: this.collection[this.count].phone};
    };

    iterator.prevMale = function () {
        if (!this.hasStart) {
            return null;
        }
        this.count--;
        while (this.count > 0 && this.collection[this.count].gender !== 'Мужской') {
            this.count--;
        }
        if (this.count < -1) {
            this.count = -1;
        }
        if ((this.count < 0) || (this.count >= this.collection.length)) {
            return null;
        }
        return {name: this.collection[this.count].name, phone: this.collection[this.count].phone};
    };

    return iterator;
};
