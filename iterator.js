'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        var depth = Number.MAX_SAFE_INTEGER;
    }
    var index = -1;
    var pointNames = getTreePoints(collection, startPoint, depth);
    return {
        next: function (name) {
            var oldIndex = index;
            index++;
            if (name !== undefined) {
                while (index < pointNames.length && pointNames[index] !== name) {
                    index++;
                }
            }
            if (index < pointNames.length) {
                return '{ name: \'' + pointNames[index] +
                    '\', phone: \'' +  collection[pointNames[index]].phone +'\' }';
            }
            index = oldIndex;
            return null;
        },
        prev: function (name) {
            var oldIndex = index;
            index--;
            if (name !== undefined) {
                while (index >=0 && pointNames[index] !== name) {
                    index--;
                }
            }
            if (index >= 0) {
                return '{ name: \'' + pointNames[index] +
                    '\', phone: \'' +  collection[pointNames[index]].phone +'\' }';
            }
            index = oldIndex;
            return null;
        },
        nextMale: function (name) {
            var oldIndex = index;
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
                return '{ name: \'' + pointNames[index] +
                    '\', phone: \'' +  collection[pointNames[index]].phone +'\' }';
            }
            index = oldIndex;
            return null;
        },
        prevMale: function (name) {
            var oldIndex = index;
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
                return '{ name: \'' + pointNames[index] +
                    '\', phone: \'' +  collection[pointNames[index]].phone +'\' }';
            }
            index = oldIndex;
            return null;
        }
    };
};

function getTreePoints(collection, startPoint, depth) {
    var queue = [];
    var depthOfPoint = {};
    var visitedPoint = {};
    var points = [];
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
