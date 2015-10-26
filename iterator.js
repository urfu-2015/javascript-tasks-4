'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        depth = Object.keys(collection).length;
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
    this._friendList = this._makeFriendList(collection, startPoint, depth);
}

Iterator.prototype._makeFriendList =
    function _makeFriendList(collection, startPoint, depth) {
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
            if (collection[collection[current.name].friends[i]] !== undefined &&
                current.depth < depth &&
                resultList.indexOf(collection[current.name].friends[i]) < 0) {
                queue.unshift({
                    name: collection[current.name].friends[i],
                    depth: current.depth + 1
                });
                tempResult.push(collection[current.name].friends[i]);
            }
        }
        /* Сортировка по алфавиту */
        tempResult.sort();
        resultList = resultList.concat(tempResult);
    }
    return resultList;
};

Iterator.prototype._updateFriendList = function _updateFriendList() {
    var currentName = this._friendList[this._currentIndex];
    this._friendList =
        this._makeFriendList(this._collection, this._startPoint, this._depth);
    if (this._friendList === null) {
        console.error('Ошибка! Удалили стартового друга!');
        return;
    } else if (this._friendList.indexOf(currentName) < 0) {
        console.error('Ошибка! Удалили текущего друга!');
        return;
    }
    this._currentIndex = this._friendList.indexOf(currentName);
};

Iterator.prototype._get = function _get(order) {
    order = order === 'next' ? 1 : -1;
    if (this._currentIndex + order < 0 ||
        this._currentIndex + order >= this._friendList.length) {
        return null;
    }
    this._currentIndex += order;
    var tempName = this._friendList[this._currentIndex];
    var tempPhone = this._collection[tempName].phone;
    return {
        name: tempName,
        phone: tempPhone
    };
};

Iterator.prototype.prev = function prev(name) {
    this._updateFriendList();
    /* Если определено имя, то ищем его */
    if (name !== undefined) {
        var resultInfo;
        do {
            resultInfo = this._get('prev');
        }
        while (resultInfo != null && resultInfo.name != name);
        return resultInfo;
    }
    return this._get('prev');
};

Iterator.prototype.next = function next(name) {
    this._updateFriendList();
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
