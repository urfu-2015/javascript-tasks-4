'use strict';

module.exports.get = function (collection, startPoint, depth) {
    return new Iterator(collection, startPoint, depth);
};

function Iterator(collection, startPoint, depth) {

    // очередь для реализации поиска в ширину
    var queue;
    // индекс текущего элемента в очереди
    var currentIndex;
    // список всех имён в книге для проверки модификаций
    var names;
    // текущий уровень вложенности
    var currentDepth;
    // индекс, при достижении которого происходит переход на следующий уровень вложенности
    var depthIncreaseIndex;
    // последнее выданное имя
    var previousName;

    // инициализация итератора
    var init = function () {
        queue = [];
        if (collection[startPoint]) {
            queue.push(startPoint);
        }
        currentIndex = -1;
        names = Object.keys(collection);
        currentDepth = 0;
        depthIncreaseIndex = queue.length;
    };

    init();

    var arrayEquals = function (array1, array2) {
        return array1.length == array2.length &&
            array1.every(function (element) {
                return array2.indexOf(element) >= 0;
            });
    };

    var checkForModifications = function () {
        var newNames = Object.keys(collection);
        if (!arrayEquals(names, newNames)) {
            init();
            this.next(previousName);
        }
    }.bind(this);

    var findPrev = function (conditionFn) {

        checkForModifications();

        while (true) {
            if (currentIndex <= 0) {
                return null;
            }
            currentIndex--;
            var current = queue[currentIndex];
            if (conditionFn(current, collection[current])) {
                previousName = current;
                return {name: current, phone: collection[current].phone};
            }
        }
    };

    this.prev = function (name) {
        return findPrev(function (personName) {
            return name === undefined || name === personName;
        });
    };

    this.prevMale = function (name) {
        return findPrev(function (personName, personData) {
            return (name === undefined || name === personName) &&
                personData.gender === 'Мужской';
        });
    };

    var findNext = function (conditionFn) {

        checkForModifications();

        while (true) {
            currentIndex++;

            var current = queue[currentIndex];
            // дошли до конца, возвращаем null
            if (current === undefined) {
                currentIndex--;
                return null;
            }

            // если не превысили глубину вложенности
            if (currentDepth <= depth || depth === undefined) {

                // добавляем друзей в очередь
                queue = queue.concat(collection[current].friends.filter(function (friend) {
                        return friend !== startPoint &&
                            names.indexOf(friend) >= 0 &&
                            queue.indexOf(friend) < 0;
                    }.bind(this)
                ).sort());

                // если остался один элемент до перехода на следующий уровень вложенности
                if (depthIncreaseIndex - currentIndex === 1) {
                    // увеличиваем уровень вложенности
                    currentDepth++;
                    // устанавливаем новую границу перехода на следующий уровень вложенности
                    depthIncreaseIndex = queue.length;
                }

            } else {
                return null;
            }
            if (current !== startPoint && conditionFn(current, collection[current])) {
                previousName = current;
                return {name: current, phone: collection[current].phone};
            }
        }
    };

    this.next = function (name) {
        return findNext(function (personName) {
            return name === undefined || name === personName;
        });
    };

    this.nextMale = function (name) {
        return findNext(function (personName, personData) {
            return (name === undefined || name === personName) &&
                personData.gender === 'Мужской';
        });
    };

}
