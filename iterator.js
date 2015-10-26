'use strict';

var GENDER = 'Мужской';

module.exports.get = function (collection, startPoint, depth) {
    if (!startPoint || !collection || !collection[startPoint]) {
        return {
            next: function () {
                return null;
            },
            prev: function () {
                return null;
            },
            nextMale: function () {
                return null;
            },
            prevMale: function () {
                return null;
            }
        };
    }
    depth = depth || Infinity;
    var view = [];
    var present = [startPoint];
    var future = [];
    var currentDepth = 1;
    var nextIndex = 0;

    createIterator();
    function createIterator() {
        var current = present[nextIndex];
        if (current) {
            if (view.indexOf(current) === -1) {
                view.push(current);
                future = future.concat(collection[current].friends);
                nextIndex++;
                createIterator();
            } else {
                nextIndex++;
                createIterator();
            }
        } else {
            currentDepth++;
            if (currentDepth <= depth) {
                present = [].concat(future);
                future = [];
                nextIndex = 0;
                current = present[nextIndex];
                if (current) {
                    if (view.indexOf(current) === -1) {
                        view.push(current);
                        future = future.concat(collection[current].friends);
                        nextIndex++;
                        createIterator();
                    } else {
                        nextIndex++;
                        createIterator();
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    };

    var index = 0;
    return {
        next: function (name) {
            if (name) {
                var number = view.indexOf(name);
                if (number > -1) {
                    index = number;
                }
            } else {
                index++;
            }
            if (view[index]) {
                return { name: view[index], phone: collection[view[index]].phone };
            } else {
                return null;
            }
        },
        prev: function () {
            index--;
            if (view[index]) {
                return {name: view[index], phone: collection[view[index]].phone};
            } else {
                return null;
            }
        },
        nextMale: function (name) {
            if (name) {
                var number = view.indexOf(name);
                if (number > -1) {
                    index = number;
                }
            } else {
                index++;
            }
            if (view[index]) {
                if (collection[view[index]].gender === GENDER) {
                    return {name: view[index], phone: collection[view[index]].phone};
                } else {
                    index++;
                    return this.nextMale();
                }
            } else {
                return null;
            }
        },
        prevMale: function () {
            index--;
            if (view[index]) {
                if (collection[view[index]].gender === GENDER) {
                    return {name: view[index], phone: collection[view[index]].phone};
                } else {
                    return this.prevMale();
                }
            } else {
                return null;
            }
        }
    };
};
