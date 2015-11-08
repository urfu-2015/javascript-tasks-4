'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        depth = Infinity;
    } else if (depth < 0) {
        console.error('Ошибка! Неверное значение аргумента!');
        return;
    }
    return new Iterator(collection, startPoint, depth);
};

function Iterator(collection, startPoint, depth) {
    this._collection = collection;
    this._startPoint = startPoint;
    this._depth = depth;
    this._currentIndex = 0;
    this._list = this._getFriends(collection, startPoint, depth);
}

Iterator.prototype._getFriends = function _getFriends(collection, startPoint, depth) {
    if (collection[startPoint] === undefined) {
        return null;
    }
    var resultList = [startPoint];
    var queue = [{
        name: startPoint,
        depth: 0
    }];
    /* Составление списка друзей, друзей друзей ... */
    while (queue.length > 0) {
        var tempResult = [];
        var current = queue.pop();
        for (var i = 0; i < collection[current.name].friends.length; ++i) {
            var name = collection[current.name].friends[i];
            if (collection[name] !== undefined &&
                current.depth < depth &&
                resultList.indexOf(name) < 0) {
                queue.unshift({
                    name: name,
                    depth: current.depth + 1
                });
                tempResult.push(name);
            }
        }
        /* Сортировка по алфавиту */
        tempResult.sort();
        resultList = resultList.concat(tempResult);
    }
    return resultList;
};

Iterator.prototype._updateFriendList = function _updateFriendList() {
    var currentName = null;
    if (this._list !== null) {
        currentName = this._list[this._currentIndex];
    }
    this._list =
        this._getFriends(this._collection, this._startPoint, this._depth);
    if (this._list === null) {
        console.error('Ошибка! Удалили стартового друга!');
        return;
    }
    if (this._list.indexOf(currentName) < 0) {
        console.error('Ошибка! Удалили текущего друга!');
        return;
    }
    this._currentIndex = this._list.indexOf(currentName);
};

Iterator.prototype._get = function _get(order) {
    order = order === 'next' ? 1 : -1;
    if (this._currentIndex + order < 0 ||
        this._currentIndex + order >= this._list.length) {
        return null;
    }
    this._currentIndex += order;
    var name = this._list[this._currentIndex];
    var phone = this._collection[name].phone;
    return {
        name: name,
        phone: phone
    };
};

Iterator.prototype.prev = function prev(name) {
    this._updateFriendList();
    if (this._list === null) {
        return null;
    }
    /* Если определено имя, то ищем его */
    if (name !== undefined) {
        var resultInfo;
        do {
            resultInfo = this._get('prev');
        }
        while (resultInfo !== null && resultInfo.name !== name);
        return resultInfo;
    }
    return this._get('prev');
};

Iterator.prototype.next = function next(name) {
    this._updateFriendList();
    if (this._list === null) {
        return null;
    }
    /* Если определено имя, то ищем его */
    if (name !== undefined) {
        var resultInfo;
        do {
            resultInfo = this._get('next');
        }
        while (resultInfo != null && resultInfo.name != name);
        return resultInfo;
    }
    return this._get('next');
};

Iterator.prototype.prevMale = function prevMale(name) {
    var resultInfo;
    do {
        resultInfo = this.prev(name);
    }
    while (resultInfo != null &&
    this._collection[resultInfo.name].gender != 'Мужской');
    return resultInfo;
};

Iterator.prototype.nextMale = function nextMale(name) {
    var resultInfo;
    do {
        resultInfo = this.next(name);
    }
    while (resultInfo != null &&
    this._collection[resultInfo.name].gender != 'Мужской');
    return resultInfo;
};
