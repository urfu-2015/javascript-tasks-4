'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        depth = 0;
        for (var p in collection) {
            depth += 1;
        }
    } else if (depth < 0) {
        throw new new RangeError('depth cant be a negative number.');
    }
    return new Iterator(collection, startPoint, depth);
};

function Iterator(collection, startPoint, depth) {
    this.current = startPoint,
    this.prev = name => this.find(-1, name);
    this.next = name => this.find(1, name);
    this.prevMale = name => this.find(-1, name, 'Мужской');
    this.nextMale = name => this.find(1, name, 'Мужской');
    this.find = function (side, name, gender) {
        var friends_list = get_friends_list(collection, startPoint, depth);
        var index = friends_list.indexOf(this.current);
        do {
            if (index === -1 || !(side === 1 || side === -1) ||
                (side === 1 && index + 1 === friends_list.length) ||
                (side === -1 && index === 0)) {
                return null;
            }
            index += side;
            this.current = friends_list[index];
        } while ((gender !== undefined && collection[this.current].gender !== gender) ||
                    (name !== undefined && this.current !== name));
        return collection[this.current];
    };
}

function get_friends_list(collection, start, max_depth) {
    if (collection === undefined ||
        collection[start] === undefined) {
        return [ start ];
    }
    var out = [ start ];
    var queue = [{ name: start, depth: 0 }];
    while (queue.length !== 0) {
        var current = queue.pop();
        for (var i = 0; i < collection[current.name].friends.length; i++) {
            if (!Boolean(out.indexOf(collection[current.name].friends[i]) + 1) &&
                collection[collection[current.name].friends[i]] !== undefined &&
                current.depth < max_depth) {
                out.push(collection[current.name].friends[i]);
                queue.unshift({ name: collection[current.name].friends[i],
                                depth: current.depth + 1 });
            }
        }
    }
    return out;
}

