'use strict';

function MagicIterator(collection, startPoint, depth) {
    var current = startPoint;
    var collectionLength = Object.keys(collection).length;
    var namesList = getFriends(collection, startPoint, depth);
    var genderVocab = { m: 'Мужской', g: 'Женский' };
    this.next = name => this.get(1, name);
    this.prev = name => this.get(-1, name);
    this.nextMale = name => this.get(1, name, genderVocab.m);
    this.prevMale = name => this.get(-1, name, genderVocab.m);
    this.needsUpdate = collection => collectionLength !== Object.keys(collection).length;
    this.get = function (direction, name, gender) {
        if (this.needsUpdate(collection)) {
            collectionLength = Object.keys(collection).length;
            namesList = getFriends(collection, startPoint, depth);
        }
        var pos = namesList.indexOf(current);
        do {
            if ((pos + 1 === namesList.length && direction > 0) ||
                (pos < 1 && direction < 0) || pos < 0) {
                return pos = null;
            }
            pos += direction;
            current = namesList[pos];
        } while ((name !== undefined && current !== name) ||
            (gender !== undefined && gender !== collection[current].gender));
        return pos === null ? null : { name: current, phone: collection[current].phone };
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
    if (depth === undefined) {
        depth = Infinity;
    }

    return new MagicIterator(collection, startPoint, depth);
};
