'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var collectionSize = Object.keys(collection).length;
    var log = [];

    var collectionHandler = function () {
        if (collectionSize !== Object.keys(collection).length) {
            contactQueue = initQueue();
            collectionSize = Object.keys(collection).length;
            do {
                var contact = collection[log.pop()];
            }
            while (!contact && log);
            queueCounter = contactQueue.indexOf(contact);
        }
    };

    var initQueue = function () {
        var getFriends = function (contact) {
            return contact.friends.sort().map(function (entry) {
                contactName = entry;
                contact = collection[contactName];
                if (!contact) {
                    return;
                }
                contact.name = contactName;
                return contact;
            }).filter(function (entry){
                return typeof entry !== 'undefined';
            });
        };
        var contactName = startPoint;
        var contact = collection[contactName];
        if (!contact) {
            return [];
        }
        contact.name = contactName;
        var contactQueue = [contact];
        var depthLevel = getFriends(contact);
        contactQueue = contactQueue.concat(depthLevel);
        var handShake = 1;
        do {
            depthLevel = depthLevel.reduce(function (previousContact, currentContact) {
                return previousContact.concat(function () {
                    return getFriends(currentContact);
                }());
            }, []);
            var areContactsFound = false;
            contactQueue = contactQueue.concat(depthLevel.filter(function (entry) {
                if (contactQueue.indexOf(entry) !== -1) {
                    return false;
                }
                areContactsFound = true;
                return true;
            }));
            if (!areContactsFound) {
                break;
            };
            handShake++;
        }
        while (handShake !== depth);
        return contactQueue;
    };

    var contactQueue = initQueue();
    var queueCounter = 0;

    return {
        next: function () {
            collectionHandler();
            var isNameGiven = arguments[0] !== undefined;
            do {
                queueCounter++;
                var contact = contactQueue[queueCounter];
                if (!contact) {
                    return null;
                }
                var isNameFound = contact.name === arguments[0];
            }
            while(isNameGiven && !isNameFound);
            var json = {};
            json.name = contact.name;
            json.phone = contact.phone;
            log.push(json.name);
            return json;
        },
        prev: function () {
            collectionHandler();
            var isNameGiven = arguments[0] !== undefined;
            do {
                queueCounter--;
                var contact = contactQueue[queueCounter];
                if (!contact) {
                    return null;
                }
                var isNameFound = contact.name === arguments[0];
            }
            while(isNameGiven && !isNameFound);
            var json = {};
            json.name = contact.name;
            json.phone = contact.phone;
            log.push(json.name);
            return json;
        },
        nextMale: function () {
            collectionHandler();
            do {
                var json = this.next();
                if (!json) {
                    return null;
                }
                var contact = collection[json.name];
            }
            while (contact.gender !== 'Мужской');
            log.push(json.name);
            return json;
        },
        prevMale: function () {
            collectionHandler();
            do {
                var json = this.prev();
                if (!json) {
                    return null;
                }
                var contact = collection[json.name];
            }
            while (contact.gender !== 'Мужской');
            log.push(json.name);
            return json;
        }
    };
};
