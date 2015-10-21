'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var currentDepth = 1;
    var currentPoint = startPoint;
    var currentIndex = 0;

    return {
        next: function () {
            var a = collection;
            var b = currentPoint;
            var add = a['Сергей'];
            if (currentIndex < collection[currentPoint].friends.length) {
                currentIndex++;
                currentPoint = collection.currentPoint.firends[currentIndex];
                return {name: currentPoint, phone: collection.currentPoint.phone};
            }
        },
        nextMale: function() {

        }
    };
};
