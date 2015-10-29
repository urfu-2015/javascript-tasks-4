'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        depth = Infinity;
    } else if (depth < 0) {
        throw new RangeError('depth cant be a negative number.');
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
        var friendsList = getFriendsList(collection, startPoint, depth);
        var index = friendsList.indexOf(this.current);
        do {
            if (index === -1 ||
                (side === 1 && index + 1 === friendsList.length) ||
                (side === -1 && index === 0)) {
                return null;
            }
            index += side;
            this.current = friendsList[index];
        } while ((gender !== undefined && collection[this.current].gender !== gender) ||
                    (name !== undefined && this.current !== name));
        return collection[this.current];
    };
}

function getFriendsList(collection, start, max_depth) {
    if (collection === undefined ||
        collection[start] === undefined) {
        return [ start ];
    }
    var out = [ start ];
    var queue = [{ name: start, depth: 0 }];
    while (queue.length !== 0) {
        var current = queue.pop();
        if (current.depth >= max_depth) {
            continue;
        }
        var friends = collection[current.name].friends;
        friends.filter(friend =>
                    !Boolean(out.indexOf(friend) + 1) && collection[friend] !== undefined
                ).
                sort().
                forEach(friend => {
                    out.push(friend);
                    queue.unshift({ name: friend,
                                    depth: current.depth + 1 });
                });
    }
    return out;
}

