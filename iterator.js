'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var contactName = startPoint;
    var visited = new Set([contactName]);
    var contact = collection[contactName];
    var queue;
    if (contact) {
        var friendList = contact.friends.sort();
        var queue = [].concat(friendList);
    }
    var qc = -1; // queue counter
    var handShakes = 0;
    return {
        next: function (name) {
            if (name) {
                qc = queue.indexOf(name) - 1;
            }
            qc++;
            if (!contact || handShakes === depth) {
                return null;
            }
            contactName = queue[qc];
            if (!contactName) {
                return null;
            }
            contact = collection[contactName];
            var contactPhone = contact.phone;
            var friendList = contact.friends.sort();
            var json = {
                name: contactName,
                phone: contactPhone
            };
            queue = queue.concat(friendList.filter(function (entry) {
                if (visited.has(entry)) {
                    return false;
                }
                return true;
            }));
            visited.add(contactName);
            handShakes++;
            return json;
        },

        prev: function (name) {
            if (name) {
                qc = queue.indexOf(name) + 1;
            }
            qc--;
            if (!contact || handShakes === depth) {
                return null;
            }
            contactName = queue[qc];
            if (!contactName) {
                return null;
            }
            contact = collection[contactName];
            var contactPhone = contact.phone;
            var json = {
                name: contactName,
                phone: contactPhone
            };
            visited.add(contactName);
            handShakes++;
            return json;
        },

        nextMale: function () {
            do {
                qc++;
                if (!contact || handShakes === depth) {
                    return null;
                }
                contactName = queue[qc];
                if (!contactName) {
                    return null;
                }
                contact = collection[contactName];
                var contactGender = contact.gender;
                var friendList = contact.friends.sort();
                queue = queue.concat(friendList.filter(function (entry) {
                if (visited.has(entry)) {
                    return false;
                }
                return true;
            }));
            }
            while (contactGender != 'Мужской' || visited.has(contactName));
            var contactPhone = contact.phone;
            var json = {
                name: contactName,
                phone: contactPhone
            };
            visited.add(contactName);
            handShakes++;
            return json;
        },

        prevMale: function () {
            do {
                qc--;
                if (!contact || handShakes === depth) {
                    return null;
                }
                contactName = queue[qc];
                if (!contactName) {
                    return null;
                }
                contact = collection[contactName];
                var contactGender = contact.gender;
            }
            while (contactGender != 'Мужской');
            var contactPhone = contact.phone;
            var json = {
                name: contactName,
                phone: contactPhone
            };
            visited.add(contactName);
            handShakes++;
            return json;
        }
    };
};
