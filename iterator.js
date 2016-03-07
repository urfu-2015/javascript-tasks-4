'use strict';

module.exports.get = function (collection, bridegroomName, depth) {
    var allFriends = [];
    if (collection[bridegroomName]) {
        // Всего друзей в телефонной книге.
        var friendsCount = Object.keys(collection).length;

        // Глубину не передали или передали больше, чем допустимо, берём максимальную.
        if (depth === undefined || depth > friendsCount) {
            depth = friendsCount;
        }

        fillAllFriends();
    }

    /**
     * Наполняет список всех друзей
     */
    function fillAllFriends() {
        // Коллекция всех приглашённых друзей. Жених первый в списке.
        allFriends = [bridegroomName];

        // Друзья, у которых будем искать их друзей.
        var currentFriends;
        for (var i = 0; i < depth; i++) {
            if (!currentFriends) {
                // В начале здесь только сам жених.
                currentFriends = [bridegroomName];
            }

            // Получить список ближайших друзей тех людей, кто сейчас в коллекции currentFriends
            currentFriends = getCurrentFriends(currentFriends);

            // Добавить этот список в список всех приглашённых
            allFriends = allFriends.concat(currentFriends);
        }
    }

    /**
     * Возвращает список ближайших друзей для тех, кто в параметре currentFriends.
     *
     * @param {String[]} currentFriends Люди, у которых ищем друзей.
     * @returns {String[]}
     */
    function getCurrentFriends(currentFriends) {
        var newFriends = [];

        currentFriends.forEach(function (friend) {
            var currentFriend = collection[friend];

            if (currentFriend) {
                var friends = currentFriend.friends.filter(function (friend) {
                    return collection[friend] &&
                        allFriends.indexOf(friend) < 0 && newFriends.indexOf(friend) < 0;
                }).sort();
                newFriends = newFriends.concat(friends);
            }
        });

        return newFriends;
    }

    // Индекс имени друга в массиве всех друзей
    var indexFriend = 0;
    var currentFriend = allFriends[0];

    /**
     * Возвращает объект с именем и телефоном друга
     *
     * @param indexFriend индекс имени друга в массиве всех друзей
     * @returns {{name: *, phone: *}}
     */
    function getFriend(indexFriend) {
        return {
            name: allFriends[indexFriend],
            phone: collection[allFriends[indexFriend]].phone
        };
    }

    /**
     * Возвращает новый список всех друзей, если количество полей в коллекции изменилось
     *
     * @returns {String[]}
     */
    function getNewAllFriends() {
        if (Object.keys(collection).length < friendsCount) {
            fillAllFriends();
            indexFriend = allFriends.indexOf(currentFriend);
        }
    }

    return {
        next: function (name) {
            getNewAllFriends();

            if (name) {
                currentFriend = name;
                indexFriend = allFriends.indexOf(name);
                var isFriend = collection[name] && indexFriend !== -1 && indexFriend !== 0;

                return isFriend ? {
                    name: name,
                    phone: collection[name].phone
                } : null;
            }

            if (indexFriend < allFriends.length - 1) {
                indexFriend++;
                currentFriend = allFriends[indexFriend];
                return getFriend(indexFriend);
            }

            return null;
        },
        prev: function () {
            getNewAllFriends();

            if (indexFriend > 0) {
                indexFriend--;
                currentFriend = allFriends[indexFriend];
                return getFriend(indexFriend);
            }

            return null;
        },
        nextMale: function () {
            getNewAllFriends();

            if (indexFriend < allFriends.length - 1) {
                indexFriend++;
                currentFriend = allFriends[indexFriend];

                var person = collection[allFriends[indexFriend]];
                if (person && person.gender === 'Мужской') {
                    return getFriend(indexFriend);
                } else {
                    return this.nextMale();
                }
            }

            return null;
        },
        prevMale: function () {
            getNewAllFriends();

            if (indexFriend >= 1) {
                indexFriend--;
                currentFriend = allFriends[indexFriend];

                var person = collection[allFriends[indexFriend]];
                if (person && person.gender === 'Мужской') {
                    return getFriend(indexFriend);
                } else {
                    return this.prevMale();
                }
            }

            return null;
        }
    };
};
