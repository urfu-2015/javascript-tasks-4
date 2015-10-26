'use strict';

module.exports.get = function (collection, startPoint, depth) {
    return new Iterator(collection, startPoint, depth);
};

function Iterator(collection, startPoint, depth) {
    this.collection = collection;
    this.callList = BFS(collection, depth, [startPoint], [startPoint], 0);
    this.callList.splice(0, 1);
    this.iterIndex = -1;
    this.current = null;
}

Iterator.prototype.next = function (name) {
    if (name) {
        this.insertNow(name);
    }
    if (this.iterIndex === this.callList.length - 1) {
        this.iterIndex++;
    }
    if (this.iterIndex === this.callList.length) {
        this.current = null;
    } else {
        this.current = this.callList[++this.iterIndex];
    }
    return this.JSONCurrent();
};

Iterator.prototype.prev = function () {
    if (this.iterIndex === 0) {
        this.iterIndex--;
    }
    if (this.iterIndex === -1) {
        this.current = null;
    } else {
        this.current = this.callList[--this.iterIndex];
    }
    return this.JSONCurrent();
};

Iterator.prototype.nextMale = function (name) {
    if (name) {
        this.insertNow(name);
    }
    do {
        this.next();
    } while (this.current && this.collection[this.current].gender !== 'Мужской');
    return this.JSONCurrent();
};

Iterator.prototype.prevMale = function () {
    do {
        this.prev();
    } while (this.current && this.collection[this.current].gender !== 'Мужской');
    return this.JSONCurrent();
};

Iterator.prototype.insertNow = function (name) {
    var nameIndex = this.callList.indexOf(name);
    if (nameIndex === -1) return;
    if (nameIndex < this.iterIndex) {
        this.iterIndex--;
    }
    this.callList.splice(nameIndex, 1);
    this.callList.splice(this.iterIndex + 1, 0, name);
};

Iterator.prototype.JSONCurrent = function () {
    if (!this.current) return this.current;
    return JSON.stringify({
        name: this.current,
        phone: this.collection[this.current].phone
    });
};

function BFS(collection, depth, result, queue, i) {
    if (i === depth) return result;
    var friends = collection[queue.shift()].friends
        .filter(friend => result.indexOf(friend) === -1)
        .sort();
    friends.forEach(friend => {
        queue.push(friend);
        result.push(friend);
    });
    friends.forEach(friend => {
        BFS(collection, depth, result, queue, i + 1);
    });
    return result;
}
