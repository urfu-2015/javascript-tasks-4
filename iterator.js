'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (collection[startPoint]) {
        var currentList = collection[startPoint].friends.sort();// это текущий список,
        //по которому идем
    }
    var currentPersonIndex = -2;//это индекс в текущем списке человека,
    //которого мы вернули последним
    var previousPersons = [startPoint]; //это все люди, друзей которых мы уже
    //просмотрели(для последнего просматриваем еще)
    // это нужно чтобы 1. Избежать повторов 2. Удобно возвращаться назад
    if (typeof depth === 'undefined') {
        depth = Number.MAX_VALUE;
    }
    var collectionLength = Object.keys(collection).length;
    var collectionsKeys = Object.keys(collection);
    var lastName = null;
    return {
        next: function (targetPerson) {
            return this.hiddenNext(false, targetPerson);
        },
        nextMale: function () {
            return this.hiddenNext(true);
        },
        prev: function () {
            return this.hiddenPrev(false);
        },
        prevMale: function () {
            return this.hiddenPrev(true);
        },
        hiddenNext: function (parameter, targetPerson) {
            if (!collection[startPoint] || depth === 0) {
                // console.log('null');
                return null;
            }
            if (targetPerson && !collection[targetPerson]) {
                return null;
            }
            this.checkChanges();
            if (currentPersonIndex < -1) {
                currentPersonIndex = -1;
            }
            currentPersonIndex++;
            while (currentPersonIndex <= currentList.length) {
                if (currentPersonIndex === currentList.length) {// мы дошли до
                    //конца текущего списка
                    // и пытаемся найти нового человека(name) для обхода его друзей
                    var name = findNextName(collection, previousPersons, depth);
                    if (name === null) {
                        // console.log('null');
                        return null;
                    }
                    currentPersonIndex = 0;
                    currentList = collection[name].friends.sort();
                }
                var friendName = currentList[currentPersonIndex];
                var previouslyUnused = false;
                for (var i = 0; i < previousPersons.length - 1; i++) {
                    var tempList = collection[previousPersons[i]].friends;
                    if (tempList.indexOf(friendName) !== -1) {
                        previouslyUnused = true;
                    }
                };
                if (previouslyUnused) {//не был ли человек уже выведен ранее
                    currentPersonIndex++;
                    continue;
                }
                if (friendName === startPoint) {// не начальный ли это человек,
                    //для него предыдущая
                    //проверка не работает, так как мы же его не выводили
                    currentPersonIndex++;
                    continue;
                }
                if (parameter && collection[friendName].gender !== 'Мужской') {//проверка на пол,
                    //если она вообще нужна
                    currentPersonIndex++;
                    continue;
                }
                if (targetPerson && friendName !== targetPerson) { //это когда нам нужно next
                    currentPersonIndex++;
                    continue;
                }
                console.log(friendName);
                lastName = friendName;
                return Object(collection[friendName]);
            };
            // console.log('null');
            return null;
        },
        hiddenPrev: function (parameter) {
            this.checkChanges(); // проверяем не изменилась ли коллекция
            if (!collection[startPoint]) {
                // console.log('null');
                return null;
            }
            if (currentPersonIndex < -1) {
                return null;
            }
            if (currentPersonIndex !== -1) {
                currentPersonIndex--;
            }
            while (currentPersonIndex >= -1) {
                if (currentPersonIndex === -1) { //текущий список прошли до начала,
                    //пытаемся вернуться к тому,
                    //кого до этого обходили
                    if (previousPersons.length === 1) {
                        console.log(startPoint);
                        currentPersonIndex--;
                        return Object(collection[startPoint]);
                    }
                    previousPersons.pop();
                    var name = previousPersons[previousPersons.length - 1];
                    if (typeof name === 'undefined') {
                        // console.log('null');
                        return null;
                    }
                    currentList = collection[name].friends.sort();
                    currentPersonIndex = currentList.length - 1;
                }
                var friendName = currentList[currentPersonIndex];
                var previouslyUnused = false;
                for (var i = 0; i < previousPersons.length - 1; i++) {
                    var tempList = collection[previousPersons[i]].friends;
                    if (tempList.indexOf(friendName) !== -1) {
                        previouslyUnused = true;
                    }
                };
                if (previouslyUnused) {//не был ли человек уже выведен ранее
                    currentPersonIndex--;
                    continue;
                }
                if (previousPersons.indexOf(friendName) !== -1) {
                    currentPersonIndex--;
                    continue;
                }
                if (parameter && collection[friendName].gender !== 'Мужской') {
                    currentPersonIndex--;
                    continue;
                }
                console.log(friendName);
                lastName = friendName;
                return Object(collection[friendName]);
            };
            // console.log('null');
            return null;
        },
        checkChanges: function () {
            var newCollectionLength = Object.keys(collection).length;
            if (newCollectionLength == collectionLength) {
                return;
            }
            deleteFromCollection(collection, collectionsKeys);
            if (collection[startPoint]) {
                currentList = collection[startPoint].friends.sort();
            }
            currentPersonIndex = -2;
            previousPersons = [startPoint];
            collectionLength = newCollectionLength;
            collectionsKeys = Object.keys(collection);
            //console.log('LAST:',lastName);
            this.next(lastName);
        }
    };
};


function findNextName(collection, previousPersons, MaxDepth) {
    // BFS
    var used = [previousPersons[0]];
    var queue = [previousPersons[0]];
    var depth = [0];
    while (queue.length > 0) {
        var person = queue.shift();
        var parentDepth = depth.splice(0, 1)[0];
        if (previousPersons.indexOf(person) === -1) {
            previousPersons.push(person);
            return person;
        }
        var friends = collection[person].friends.sort();
        for (var i = 0; i < friends.length; i++) {
            var currentDepth = parentDepth + 1;
            if (used.indexOf(friends[i]) === -1 &&
                currentDepth < MaxDepth) {
                queue.push(friends[i]);
                depth.push(currentDepth);
                used.push(friends[i]);
            };
        };
    };
    return null;
}

function deleteFromCollection(collection, OldKeys) {
    var remoteName;
    OldKeys.forEach(function (name) {
        if (!collection[name]) {
            remoteName = name;
        }
    });
    console.log('REMOTE:', remoteName);
    for (var e in collection) {
        for (var i = 0; i < collection[e].friends.length; i++) {
            if (collection[e].friends[i] === remoteName) {
                collection[e].friends.splice(i, 1);
            }
        };
    }
}
