'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var contactQueue = [];
    var qc = -1; // contact queue counter
    var visitedContacts = new Set();
    var contactName = startPoint;
    var contact = collection[contactName];

    var add2Queue = function (contactNames) {
        return contactQueue.concat(contactNames.map(function (_contactName) {
            var _contact = collection[_contactName];
            if (visitedContacts.has(_contactName) || !_contact) {
                return;
            }
            var newContact = Object.assign({}, _contact);
            newContact.name = _contactName;
            newContact.source = contact;
            newContact.friends = newContact.friends.filter(function (_contactName) {
                return _contactName !== contact.name;
            });
            newContact.depth = contact.depth + 1;
            return newContact;
        })).filter(function (_contact) {
            return (typeof _contact !== 'undefined');
        });
    };

    var isCollectionChanged = function () {
        var _contact = contact;
        do {
            var isContactDeleted = typeof collection[_contact.name] === 'undefined';
            var isSourceDeleted = typeof _contact.source === 'undefined';
            if (isContactDeleted || isSourceDeleted) {
                return true;
            }
            _contact = _contact.source;
        }
        while (_contact.name !== startPoint);
        return false;
    };

    if (contact) {
        contact.name = contactName;
        contact.source = contact;
        contact.depth = 0;
        visitedContacts.add(contact.name);
        contactQueue = add2Queue(contact.friends.sort());
    }

    return {
        next: function () {
            do {
                qc++;
                contact = contactQueue[qc];
                if (!contact || contact.depth > depth) {
                    return null;
                }
                if (isCollectionChanged()) {
                    contactQueue.splice(qc, 1);
                    qc--;
                    contact = {};
                } else {
                    var friendList = contact.friends.sort();
                    contactQueue = add2Queue(friendList);
                }
                var isContactNameGiven = typeof arguments[0] !== 'undefined';
                var isContactFound = contact.name === arguments[0];
                var isContactVisited = visitedContacts.has(contact.name) && !isContactNameGiven;
                var isContactDeleted = contact === {};
            }
            while ((isContactNameGiven && !isContactFound) || isContactVisited || isContactDeleted);
            var json = {
                name: contact.name,
                phone: contact.phone
            };
            visitedContacts.add(contact.name);
            return json;
        },

        prev: function () {
            do {
                qc--;
                contact = contactQueue[qc];
                if (!contact || contact.depth > depth) {
                    return null;
                }
                if (isCollectionChanged()) {
                    contactQueue.splice(qc, 1);
                    contact = {};
                }
                var isContactNameGiven = typeof arguments[0] !== 'undefined';
                var isContactFound = contact.name === arguments[0];
                var isContactDeleted = contact === {};
            }
            while ((isContactNameGiven && !isContactFound) || isContactDeleted);
            var json = {
                name: contact.name,
                phone: contact.phone
            };
            visitedContacts.add(contact.name);
            return json;
        },

        nextMale: function () {
            do {
                qc++;
                contact = contactQueue[qc];
                if (!contact || contact.depth > depth) {
                    return null;
                }
                if (isCollectionChanged()) {
                    contactQueue.splice(qc, 1);
                    qc--;
                    contact = {};
                } else {
                    var friendList = contact.friends.sort();
                    contactQueue = add2Queue(friendList);
                }
                var isContactVisited = visitedContacts.has(contact.name);
                var isContactDeleted = contact === {};
            }
            while ((contact.gender != 'Мужской') || isContactVisited || isContactDeleted);
            var json = {
                name: contact.name,
                phone: contact.phone
            };
            visitedContacts.add(contact.name);
            return json;
        },

        prevMale: function () {
            do {
                qc--;
                contact = contactQueue[qc];
                if (!contact || contact.depth > depth) {
                    return null;
                }
                if (isCollectionChanged()) {
                    contactQueue.splice(qc, 1);
                    contact = {};
                }
                var isContactDeleted = contact === {};
            }
            while ((contact.gender != 'Мужской') || isContactDeleted);
            var json = {
                name: contact.name,
                phone: contact.phone
            };
            visitedContacts.add(contact.name);
            return json;
        }
    };
};
