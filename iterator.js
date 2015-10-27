'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var iterator = {count: -1, collection: [], started: true};
    var stackFriends = [];
    var visited = [];

    if (Object.keys(collection).indexOf(startPoint) == -1) {
        iterator.started = false;
    } else {
        stackFriends.push({name: startPoint, depth: 0});

        while (visited.length < Object.keys(collection).length) {
            var current = stackFriends.shift();
            if (current.depth >= depth) {
                break;
            }

            if (current.name !== startPoint) {
                var note = collection[current.name];
                note.name = current.name;
                iterator.collection.push(note);
            }

            visited.push(current.name);
            var currentFriends = collection[current.name].friends.sort();
            for (var i = 0; i < currentFriends.length; i++) {
                if (visited.indexOf(currentFriends[i]) === -1) {
                    stackFriends.push({name: currentFriends[i], depth: current.depth + 1});
                }
            }
        }
    }

    iterator.next = function () {
        if (!this.started) {
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
        // console.log("name:" + this.collection[this.count].name + ", " +
        //     "phone:" + this.collection[this.count].phone);
    }

    iterator.prev = function () {
        if (!this.started) {
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
        // console.log("name:" + this.collection[this.count].name + ", " +
        //     "phone:" + this.collection[this.count].phone);
    }

    iterator.nextMale = function () {
        if (!this.started) {
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
        // console.log("name:" + this.collection[this.count].name + ", " +
        //     "phone:" + this.collection[this.count].phone);
    }

    iterator.prevMale = function () {
        if (!this.started) {
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
        // console.log("name:" + this.collection[this.count].name + ", " +
        //     "phone:" + this.collection[this.count].phone);
    }

    return iterator;
}
