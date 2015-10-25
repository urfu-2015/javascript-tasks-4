'use strict';

module.exports.get = function (collection, startPoint, depth) {
    depth = depth || Object.keys(collection).length;
    var usedContacts = new Set();
    var queue = [];
    var parents = {};
    var _depth = {};
    var currentContact = startPoint;
    _depth[currentContact] = 0;
    var prevsCount = 0;
    var prevsMaleCount = 0;
    var traversal = [];
    var maleTraversal = [];
    if (collection[currentContact]) {
        var contactData = collection[currentContact];
        contactData.name = currentContact;
        parents[currentContact] = null;
        traversal.push(contactData);
        if (contactData.gender == 'Мужской') {
            maleTraversal.push(contactData);
        }
    }
    function *generator() {
        while (!collection[startPoint]) {
            yield null;
        }
        queue.push(startPoint);
        while (queue) {
            currentContact = queue.shift();
            while (!currentContact) {
                yield null;
            }
            usedContacts.add(currentContact);
            var friends = collection[currentContact].friends.sort();
            for (var j = 0; j < friends.length; j++) {
                var contact = friends[j];
                while (prevsCount > 0) {
                    yield traversal[traversal.length - prevsCount];
                    prevsCount--;
                }
                if (!usedContacts.has(contact) && _depth[currentContact] < depth) {
                    var contactData = collection[contact];
                    contactData.name = contact;
                    if (contactData.gender == 'Мужской') {
                        maleTraversal.push(contactData);
                    }
                    queue.push(contact);
                    parents[contact] = currentContact;
                    _depth[contact] = _depth[currentContact] + 1;
                    usedContacts.add(contact);
                    //traversal.push(contact);
                    traversal.push(contactData);
                    yield contactData;
                }
            }
        }
        return null;
    }

    var gen = generator();

    function prev() {
        if (traversal.length - prevsCount - 2 < 0) {
            return null;
        }
        prevsCount++;
        return traversal[traversal.length - prevsCount - 1];
    }

    function nextMale() {
        if (prevsMaleCount > 0) {
            prevsMaleCount--;
            return traversal[traversal.length - prevsMaleCount - 1];
        }
        while (true) {
            var contact = gen.next().value;
            if (!contact) {
                return null;
            }
            if (contact.gender == 'Мужской') {
                return contact;
            }
        }
    }

    function prevMale() {
        if (maleTraversal.length - prevsMaleCount - 2 < 0) {
            return null;
        }
        prevsMaleCount++;
        return maleTraversal[maleTraversal.length - prevsMaleCount - 1];
    }

    function next(name) {
        if (!name) {
            return gen.next().value;
        }
        while (true) {
            var contact = gen.next().value;
            if (!contact) {
                return null;
            }
            if (contact.name === name) {
                return contact;
            }
        }
    }
    return {
        next: next,
        prev: prev,
        nextMale: nextMale,
        prevMale: prevMale
    };
};
