'use strict';

function MagicIterator(collection, startPoint, depth) {
    this.current = startPoint;
    this.collectionLength = Object.keys(collection).length;
    this.next = name => this.get(1, name);
    this.prev = name => this.get(-1, name);
    this.nextMale = name => this.get(1, name, 'М');
    this.prevMale = name => this.get(-1, name, 'М');
    this.isNeedUpdate = collection => this.collectionLength !== Object.keys(collection).length;
    this.namesList = getFriends(collection, startPoint, depth);
    this.get = function (direction, name, gender) {
        if (this.isNeedUpdate(collection)) {
            this.collectionLength = Object.keys(collection).length;
            this.namesList = getFriends(collection, startPoint, depth);
        }
        var pos = this.namesList.indexOf(this.current);
        do {
            if ((pos + 1 === this.namesList.length && direction > 0) ||
                (pos <= 1 && direction < 0) || pos < 0) {
                return pos = null;
            }
            pos += direction;
            this.current = this.namesList[pos];
        } while ((name !== undefined && this.current !== name) ||
            (gender !== undefined &&
            !new RegExp('^' + gender, 'i').test(collection[this.current].gender)));

        return pos === null ? null : { name: this.current, phone: collection[this.current].phone };
    };
}

function getFriends(collection, startPoint, depth) {
    if (collection[startPoint] === undefined) {
        return [startPoint];
    }
    var result = [ startPoint ];
    var queue = result.slice();
    while (queue.length && depth--) {
        var length = queue.length;

        for (var i = 0; i < length; i++) {
            var name = queue.shift();
            var friends = collection[name].friends;
            friends.filter(item =>
                    result.indexOf(item) === -1 && collection[item] !== undefined
                )
                .sort()
                .forEach(item => {
                    result.push(item);
                    queue.push(item);
                });
        }
    }
    return result;
}

module.exports.get = function (collection, startPoint, depth) {
    if (depth < 0) {
        throw new RangeError('depth should be positive!');
    } else if (depth === undefined) {
        depth = Infinity;
    }

    return new MagicIterator(collection, startPoint, depth);
};
