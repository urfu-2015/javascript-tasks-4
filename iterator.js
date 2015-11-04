'use strict';

module.exports.get = function (collection, startPoint, depth) {
    return new Iterator(collection, startPoint, depth);
};

function Iterator(collection, startPoint, depth) {
    var curent = 0;
    var maxMenWithFriend = 1;
    depth = Number.isInteger(depth) ? depth : 0;

    if (typeof startPoint === undefined || !collection.hasOwnProperty(startPoint)) {
        curent = NaN;
    } else {
        var listNames = createListNames(startPoint);
    }

    function createListNames(name) {
        var curentDepth = -1;
        var following = [];
        var curents = [name];
        var result = [];

        putNamesInResult();
        return result;

        function putNamesInResult() {
            for (var name of curents) {
                maxMenWithFriend = result.length;
                result.push(name);
                following = following.concat(getFriends(name));
            }
            if (following.length === 0) {
                return;
            }

            curents = following.sort();
            following = [];
            curentDepth++;

            if (depth - curentDepth !== 0 || depth === 0) {
                putNamesInResult();
            }
        }

        function getFriends(name) {
            var friends = [];
            for (var friend of collection[name].friends) {
                if (curents.indexOf(friend) === -1 &&
                    following.indexOf(friend) === -1 &&
                    result.indexOf(friend) === -1 &&
                    collection.hasOwnProperty(friend)) {
                    friends.push(friend);
                }
            }
            return friends;
        }
    }

    this.next = function (name) {
        if (isNaN(curent)) {
            return null;
        }
        if (isChange() && rebuild()) {
            return null;
        }
        if (name !== undefined) {
            var indexElement = listNames.indexOf(name);
            if (indexElement === -1) {
                curent = listNames.length;
                return null;
            }
            curent = indexElement;
            return collectEntry(listNames[indexElement]);
        }

        curent++;
        if (curent >= listNames.length) {
            curent = listNames.length;
            return null;
        }

        return collectEntry(listNames[curent]);
    };

    this.prev = function () {
        if (isNaN(curent)) {
            return null;
        }
        if (isChange() && rebuild()) {
            return null;
        }

        curent--;
        if (curent < 0) {
            curent = -1;
            return null;
        }

        return collectEntry(listNames[curent]);
    };

    this.nextMale = function () {
        if (isNaN(curent)) {
            return null;
        }
        if (isChange() && rebuild()) {
            return null;
        }

        for (var i = curent + 1; i < listNames.length; i++) {
            if (collection[listNames[i]].gender === 'Мужской') {
                curent = i;
                return collectEntry(listNames[i]);
            }
        };
        curent = listNames.length;
        return null;
    };

    this.prevMale = function () {
        if (isNaN(curent)) {
            return null;
        }
        if (isChange() && rebuild()) {
            return null;
        }

        for (var i = curent - 1; i > -1; i--) {
            if (collection[listNames[i]].gender === 'Мужской') {
                curent = i;
                return collectEntry(listNames[i]);
            }
        };

        curent = -1;
        return null;
    };

    function isChange() {
        var changed = !listNames.every(item => {
            return collection.hasOwnProperty(item);
        });
        if (changed) {
            return true;
        }
        for (var i = 0; i < maxMenWithFriend; i++) {
            var isNotAllFriend = collection[listNames[i]].friends.some(item => {
                if (!collection.hasOwnProperty(item)) {
                    return false;
                }
                return listNames.indexOf(item) === -1;
            });
            if (isNotAllFriend) {
                return true;
            }
        }
        return false;
    }
    function rebuild() {
        if (!collection.hasOwnProperty(startPoint)) {
            curent = NaN;
            return true;
        }
        listNames = createListNames(startPoint);
        if (curent > listNames.length) {
            curent = listNames.length;
        }
    }
    function collectEntry(name) {
        return {name: name, phone: collection[name].phone};
    }
};
