'use strict';
var d;
var start;
module.exports.get = function (collection, startPoint, depth) {
    d = depth;
    start = startPoint;
    var index = -1;
    var stack = createStack(collection, startPoint, depth);
    return {
        next: function (name) {
            var nesseseryVariable = depth;
            if (!stack) {
                return null;
            }
            if (name != undefined) {
                index = stack.indexOf(name);
            } else {
                index++;
                return index < stack.length ? {
                    name: stack[index],
                    phone: collection[stack[index]].phone
                } : null;
            }
        },

        nextMale: function () {
            var isFind = true;

            if (++index >= stack.length) {
                isFind = false;
            } else {
                while (collection[stack[index]].gender != 'Мужской' && isFind) {
                    index++;
                    if (index == stack.length) {
                        isFind = false;
                    }
                }
            }

            return isFind ? {
                name: stack[index],
                phone: collection[stack[index]].phone
            } : null;
        },

        prev: function () {
            if (!stack) {
                return null;
            }
            return index > 0 ? {
                name: stack[--index],
                phone: collection[stack[index]].phone
            } : null;
        },

        prevMale: function () {
            var isFind = true;

            if (--index < 0) {
                isFind = false;
            } else {
                while (collection[stack[index]].gender != 'Мужской' && isFind) {
                    index--;
                    if (index < 0) {
                        isFind = false;
                    }
                }
            }

            return isFind ? {
                name: stack[index],
                phone: collection[stack[index]].phone
            } : null;
        }
    };
};

function createStack(collection, startPoint) {
    return iterateFriends(collection, startPoint, 0, []);
}

function iterateFriends(collection, name, depth, stack) {
    if (depth > d) {
        return;
    }
    if (!(name in collection)) {
        return null;
    }
    for (var friend of collection[name].friends) {
        if (stack.indexOf(friend) < 0 && friend != start) {
            stack.push(friend);
            iterateFriends(collection, friend, depth + 1, stack);
        }
    }
    return stack;
}
