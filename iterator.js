'use strict';

module.exports.get = function (collection, startPoint, depth) {
    return new Iterator(collection, startPoint, depth);
};

function Iterator(collection, startPoint, depth) {
    this.collection = collection;
    this.me = startPoint;
    this.depth = depth;
    this.current = null;
    this.updateCallList();
}

Iterator.prototype.next = function (name) {
    if (name) {
        this.jumpTo(name);
    }
    this.updateCallList();
    this.iterIndex = Math.min(this.callList.length, this.iterIndex + 1);
    this.current = this.callList[this.iterIndex] || null;
    return this.JSONCurrent();
};

Iterator.prototype.prev = function () {
    this.updateCallList();
    this.iterIndex = Math.max(-1, this.iterIndex - 1);
    this.current = this.callList[this.iterIndex] || null;
    return this.JSONCurrent();
};

Iterator.prototype.nextMale = function (name) {
    if (name) {
        this.jumpTo(name);
    }
    this.updateCallList();
    do {
        this.next();
    } while (this.current && this.collection[this.current].gender !== 'Мужской');
    return this.JSONCurrent();
};

Iterator.prototype.prevMale = function () {
    this.updateCallList();
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

Iterator.prototype.jumpTo = function (name) {
    this.iterIndex = this.callList.indexOf(name) - 1;
    this.current = this.callList[this.iterIndex] || null;
};

Iterator.prototype.updateCallList = function () {
    if (!this.collection[this.me]) {
        this.callList = [];
        this.iterIndex = -1;
        return;
    }
    this.callList = BFS(this.collection, this.depth, [this.me], [this.me], 0);
    this.callList.splice(0, 1);
    this.iterIndex = this.callList.indexOf(this.current);
};

function BFS(collection, depth, result, queue, i) {
    if (i === depth || !queue.length) {
        return result;
    }
    collection[queue.shift()].friends
        .filter(friend => result.indexOf(friend) === -1 && collection[friend])
        .sort()
        .forEach(friend => {
            queue.push(friend);
            result.push(friend);
        });
    BFS(collection, depth, result, queue, i + 1);
    return result;
}
