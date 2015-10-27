'use strict';

module.exports.get = function (collection, startPoint, depth) {
    return new Iterator(collection, startPoint, depth);
};

function Iterator(collection, startPoint, depth) {
    this.collection = collection;
    this.callList = !collection[startPoint] ?
        [] : BFS(collection, depth, [startPoint], [startPoint], 0);
    this.callList.splice(0, 1);
    this.iterIndex = -1;
    this.current = null;
}

Iterator.prototype.next = function (name) {
    if (name) {
        this.iterIndex = this.callList.indexOf(name) - 1;
    }
    this.iterIndex = Math.min(this.callList.length, this.iterIndex + 1);
    this.current = this.callList[this.iterIndex] || null;
    return this.JSONCurrent();
};

Iterator.prototype.prev = function () {
    this.iterIndex = Math.max(-1, this.iterIndex - 1);
    this.current = this.callList[this.iterIndex] || null;
    return this.JSONCurrent();
};

Iterator.prototype.nextMale = function (name) {
    if (name) {
        this.iterIndex = this.callList.indexOf(name) - 1;
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

Iterator.prototype.JSONCurrent = function () {
    if (!this.current) {
        return this.current;
    }
    return JSON.stringify({
        name: this.current,
        phone: this.collection[this.current].phone
    });
};

function BFS(collection, depth, result, queue, i) {
    if (i === depth || !queue.length) {
        return result;
    }
    collection[queue.shift()].friends
        .filter(friend => result.indexOf(friend) === -1)
        .sort()
        .forEach(friend => {
            queue.push(friend);
            result.push(friend);
        });
    BFS(collection, depth, result, queue, i + 1);
    return result;
}
