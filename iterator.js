'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var currentIndex = 0;
    var queue = [];
    var used = [];
    var result = [];
    var distances = {};
    var allName = Object.keys(collection);
    if (depth === undefined) {
        depth = Infinity;
    }
    if (allName.indexOf(startPoint) === -1 && depth === 0) {

        return {
            next: function (name) {
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
    function bfs() {
        queue = [];
        used = [];
        result = [];
        distances = {};
        allName = Object.keys(collection);
        allName.forEach(function (name) {
            distances[name] = 0;
        });

        result.push(startPoint);
        used.push(startPoint);
        queue.push(startPoint);

        while (queue.length) {
            var v = queue.shift();
            try {
                collection[v].friends.forEach(function (friend) {
                    if (used.indexOf(friend) == -1) {
                        distances[friend] = distances[v] + 1;

                        if (distances[friend] > depth) {
                            throw BreakException;
                        }
                        if (allName.indexOf(friend) > -1) {
                            used.push(friend);
                            queue.push(friend);
                            result.push(friend);
                        }
                    }
                }, this);
            } catch (e) {
                if (e === ReferenceError) {
                    break;
                }
            }

        }
    }

    bfs();
    function checkAndDel() {
        var allNameNew = Object.keys(collection);
        if (allName.length !== allNameNew.length) {
            bfs();
        }
    }

    return {
        next: function (name) {
            currentIndex++;
            if (currentIndex < result.length) {
                checkAndDel(currentIndex);
                if (name) {
                    while (result[currentIndex] !== name) {
                        currentIndex++;
                        if (currentIndex < result.length) {
                            checkAndDel(currentIndex);
                        } else {
                            return null;
                        }
                    }
                }
                name = result[currentIndex];

                var c = collection[name];
                return {name: name, phone: c.phone};
            }
            return null;
        },
        prev: function () {
            currentIndex--;
            if (currentIndex >= 0) {
                checkAndDel(currentIndex);
                var name = result[currentIndex];
                var c = collection[result[currentIndex]];
                return {name: name, phone: c.phone};
            }
            return null;
        },
        nextMale: function () {
            currentIndex++;
            if (currentIndex < result.length) {
                checkAndDel(currentIndex);
                while (collection[result[currentIndex]]['gender'] !== 'Мужской') {
                    currentIndex++;
                    if (currentIndex < result.length) {
                        checkAndDel(currentIndex);
                    } else {
                        return null;
                    }
                }
                var name = result[currentIndex];
                var c = collection[result[currentIndex]];
                return {name: name, phone: c.phone};
            }
            return null;
        },
        prevMale: function () {
            currentIndex--;
            if (currentIndex >= 0) {
                checkAndDel(currentIndex);
                while (collection[result[currentIndex]]['gender'] !== 'Мужской') {
                    currentIndex--;
                    if (currentIndex >= 0) {
                        checkAndDel(currentIndex);
                    } else {
                        return null;
                    }
                }
                var name = result[currentIndex];
                var c = collection[result[currentIndex]];
                return {name: name, phone: c.phone};
            }
            return null;
        }
    };
};
