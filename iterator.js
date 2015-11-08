'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        var depth = Number.MAX_SAFE_INTEGER;
    }
    if (collection[startPoint] === undefined || depth < 0) {
        return {
            next: returnNull,
            prev: returnNull,
            nextMale: returnNull,
            prevMale: returnNull
        };
    }
    var index = 0;
    var pointNames = getTreePoints(collection, startPoint, depth);
    return {
        next: function (name) {
            index++;
            if (name !== undefined) {
                while (index < pointNames.length && pointNames[index] !== name) {
                    index++;
                }
            }
            if (index < pointNames.length) {
                return {
                    name: pointNames[index],
                    phone: collection[pointNames[index]].phone
                };
            }
            index = pointNames.length;
            return null;
        },
        prev: function (name) {
            index--;
            if (name !== undefined) {
                while (index >= 0 && pointNames[index] !== name) {
                    index--;
                }
            }
            if (index >= 0) {
                return {
                    name: pointNames[index],
                    phone: collection[pointNames[index]].phone
                };
            }
            index = -1;
            return null;
        },
        nextMale: function (name) {
            index++;
            if (name !== undefined) {
                while (
                    index < pointNames.length &&
                    collection[pointNames[index]].gender !== 'Мужской' &&
                    pointNames[index] !== name
                ) {
                    index++;
                }
            }
            while (
                index < pointNames.length &&
                collection[pointNames[index]].gender !== 'Мужской'
            ) {
                index++;
            }
            if (index < pointNames.length) {
                return {
                    name: pointNames[index],
                    phone: collection[pointNames[index]].phone
                };
            }
            index = pointNames.length;
            return null;
        },
        prevMale: function (name) {
            index--;
            if (name !== undefined) {
                while (
                    index >= 0 &&
                    collection[pointNames[index]].gender !== 'Мужской' &&
                    pointNames[index] !== name
                ) {
                    index--;
                }
            }
            while (
                index >= 0 &&
                collection[pointNames[index]].gender !== 'Мужской'
            ) {
                index--;
            }
            if (index >= 0) {
                return {
                    name: pointNames[index],
                    phone: collection[pointNames[index]].phone
                };
            }
            index = -1;
            return null;
        }
    };
};

function getTreePoints(collection, startPoint, depth) {
    var points = [];
    points.push(startPoint);
    if (depth === 0) {
        return points;
    }

    var queue = [];
    var depthOfPoint = {};
    var visitedPoint = {};
    queue.push(startPoint);
    visitedPoint[startPoint] = true;
    depthOfPoint[startPoint] = 0;
    while (queue.length !== 0) {
        var currentPoint = queue.shift();
        var neighbors = collection[currentPoint].friends.slice();
        neighbors.sort();
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (!visitedPoint[neighbor] || visitedPoint[neighbor] === undefined) {
                points.push(neighbor);
                visitedPoint[neighbor] = true;
                depthOfPoint[neighbor] = depthOfPoint[currentPoint] + 1;
                if (depthOfPoint[neighbor] < depth) {
                    queue.push(neighbor);
                }
            }
        }
    }
    return points;
}

function returnNull() {
    return null;
}
