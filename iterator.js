'use strict';

/** Основной метод, который инициализирует итератор, по сути он
    просчитывает круг друзей с нужной глубиной (если она указана),
    и предоставляет интерфейс для итерирования
 * @param {dict} collection
 * @param {string} startPoint
 * @param {Integer} depth
 * @return {function} next
 * @return {function} prev
 * @return {function} getNextMale
 * @return {function} getPrevMale
*/
module.exports.get = function (collection, startPoint, depth) {
    var result = [null];
    var badVar;
    var currentFriendIndex = 0;
    if (depth === undefined) {
        depth = Infinity;
    }
    if (!(startPoint in collection)) {
        badVar = false;
    } else {
        // BFS
        var queue = [];
        var used = [];
        var d = {};
        for (var el in collection) {
            d[el] = 0;
        }
        queue.push(startPoint);
        used.push(startPoint);
        main: while (queue.length != 0) {
            var currentFriend = queue.shift();
            for (var i = 0; i < collection[currentFriend].friends.sort().length; i++) {
                var hisFriend = collection[currentFriend].friends[i];
                if (used.indexOf(hisFriend) == -1) {
                    d[hisFriend] = d[currentFriend] + 1;
                    if (d[hisFriend] > depth) {
                        break main;
                    }
                    used.push(hisFriend);
                    queue.push(hisFriend);
                    result.push(getOutput(hisFriend));
                }
            }
        }
        // end BFS
    }

    /** Один из интерфейсов, который предоставляет итератор:
        просто сдвигает индекс, чтобы получить следующего друга (Если это возможно).
        (Воможен вариант с получением индекса конкретного имени)
     * @param {string} name
     * @return {object} null
     * @return {dict} result[currentFriendIndex]
    */
    function getNext(name) {
        if (!badVar) {
            currentFriendIndex++;
            if (currentFriendIndex < result.length) {
                if (name !== undefined) {
                    while (result[currentFriendIndex].name != name) {
                        currentFriendIndex++;
                    }
                }
                return result[currentFriendIndex];
            } else {
                currentFriendIndex = result.length;
                return null;
            }
        } else {
            return null;
        }
    };

    /** Один из интерфейсов, который предоставляет итератор:
        просто сдвигает индекс, чтобы получить предыдущего друга (Если это возможно).
     * @return {object} null
     * @return {dict} result[currentFriendIndex]
    */
    function getPrev() {
        currentFriendIndex--;
        if (currentFriendIndex <= 0) {
            currentFriendIndex = 1;
            return null;
        } else {
            return result[currentFriendIndex];
        }
    };

    /** Вспомогательная функция, которая по имени строит выходной результат,
        отсекая 'gender' и 'friends'
     * @param {string} name
     * @return {dict} temp_result
    */
    function getOutput(name) {
        var temp_result = {};
        temp_result['name'] = name;
        temp_result['phone'] = collection[name]['phone'];
        return temp_result;
    };

    /** Один из интерфейсов, который предоставляет итератор:
        просто сдвигает индекс, чтобы получить следующего друга мужского пола
        (Если это возможно).
     * @return {object} null
     * @return {dict} result[currentFriendIndex]
    */
    function getNextMale() {
        currentFriendIndex++;
        if (currentFriendIndex < result.length) {
            while (collection[result[currentFriendIndex]['name']].gender != 'Мужской') {
                currentFriendIndex++;
            }
            return result[currentFriendIndex];
        } else {
            currentFriendIndex = result.length;
            return null;
        }
    };

    /** Один из интерфейсов, который предоставляет итератор:
        просто сдвигает индекс, чтобы получить предыдущего друга мужского пола
        (Если это возможно).
     * @return {object} null
     * @return {dict} result[currentFriendIndex]
    */
    function getPrevMale() {
        currentFriendIndex--;
        if (currentFriendIndex <= 0) {
            currentFriendIndex = 1;
            return null;
        } else {
            while (collection[result[currentFriendIndex]['name']].gender != 'Мужской') {
                currentFriendIndex--;
            }
            return result[currentFriendIndex];
        }
    };

    return {
        next: getNext,
        prev: getPrev,
        nextMale: getNextMale,
        prevMale: getPrevMale
    };
};
