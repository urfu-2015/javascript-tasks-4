'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var queue = [];
    var used = [];
    var contacts = [];
    if (collection[startPoint] === undefined) {
        // 'No such person in your faceBook.'
        return null;
    }
    if (collection[startPoint]['friends'] === undefined) {
        console.log('Wrong contact format.');
        return null;
    }
    if (depth === undefined) {
        depth = Object.keys(collection).length;
    }
    queue.push(startPoint);
    used.push(startPoint);
    var depthDict = {};
    depthDict[startPoint] = 0;
    while (!(queue.length === 0)) {
        var curContact = queue.shift();
        var toAddContacts = [];
        var curFriends = collection[curContact]['friends'];
        for (var i = 0; i < curFriends.length; i++) {
            if (used.indexOf(curFriends[i]) < 0) {
                toAddContacts.push(curFriends[i]);
                depthDict[curFriends[i]] = depthDict[curContact] + 1;
                used.push(curFriends[i]);
            }
        }
        toAddContacts.sort(function (a, b) {
            var newA = a.toLocaleLowerCase();
            var newB = b.toLocaleLowerCase();
            return (newA.charCodeAt(0) - newB.charCodeAt(0));
        });
        for (var j = 0; j < toAddContacts.length; j++) {
            curContact = toAddContacts[j];
            queue.push(curContact);
            contacts.push(curContact);
        }
    }
    var resultContacts = [];
    for (var i = 0; i < contacts.length; i++) {
        if (depthDict[contacts[i]] <= depth) {
            resultContacts.push(contacts[i]);
        }
    }
    return {
        index: -1,
        next: function (name) {
            if (this.index >= resultContacts.length - 1) {
                //Контакты закончились
                return null;
            }
            if (!name) {
                this.index += 1;
                var curContact = collection[resultContacts[this.index]];
                return {
                    name: resultContacts[this.index],
                    phone: curContact.phone
                };
            } else {
                if (resultContacts.indexOf(name) < 0) {
                    return null;
                }
                this.index += 1;
                while (resultContacts[this.index] != name) {
                    if (this.index === resultContacts.length) {
                        return null;
                    }
                    this.index += 1;
                }
                var curContact = collection[resultContacts[this.index]];
                return {
                    name: resultContacts[this.index],
                    phone: curContact.phone
                };
            }
        },
        nextMale: function () {
            if (this.index >= resultContacts.length - 1) {
                //Контакты закончились
                return null;
            }
            while (this.index < resultContacts.length) {
                this.index += 1;
                var curContact = collection[resultContacts[this.index]];
                if (curContact.gender === 'Мужской') {
                    return {
                        name: resultContacts[this.index],
                        phone: curContact.phone
                    };
                }
            }
            return null;
        },
        prev: function () {
            if (this.index === 0) {
                //Контакты закончились
                return null;
            }
            this.index -= 1;
            var curContact = collection[contacts[this.index]];
            return {
                name: contacts[this.index],
                phone: curContact.phone
            };
        },
        prevMale: function () {
            if (this.index === 0) {
                //Контакты закончились
                return null;
            }
            while (this.index > 0) {
                this.index -= 1;
                var curContact = collection[contacts[this.index]];
                if (curContact.gender === 'Мужской') {
                    return {
                        name: contacts[this.index],
                        phone: curContact.phone
                    };
                }
            }
            return null;
        }
    };
};
