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
            var contactIsDeleted = typeof collection[_contact.name] === 'undefined';
            var sourceIsDeleted = typeof _contact.source === 'undefined';
            if (contactIsDeleted || sourceIsDeleted) {
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
                var contactNameGiven = typeof arguments[0] !== 'undefined';
                var contactNameFound = contact.name === arguments[0];
                var contactIsVisited = visitedContacts.has(contact.name) && !contactNameGiven;
                var contactIsDeleted = contact === {};
            }
            while ((contactNameGiven && !contactNameFound) || contactIsVisited || contactIsDeleted);
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
                var contactNameGiven = typeof arguments[0] !== 'undefined';
                var contactNameFound = contact.name === arguments[0];
                var contactIsDeleted = contact === {};
            }
            while ((contactNameGiven && contactNameFound) || contactIsDeleted);
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
                var contactIsVisited = visitedContacts.has(contact.name);
                var contactIsDeleted = contact === {};
            }
            while ((contact.gender != 'Мужской') || contactIsVisited || contactIsDeleted);
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
                var contactIsVisited = visitedContacts.has(contact.name);
                var contactIsDeleted = contact === {};
            }
            while ((contact.gender != 'Мужской') || contactIsDeleted);
            var json = {
                name: contact.name,
                phone: contact.phone
            };
            visitedContacts.add(contact.name);
            return json;
        }
    };
};
