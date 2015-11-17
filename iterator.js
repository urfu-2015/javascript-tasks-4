'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var friends = getAllFriends(collection, startPoint, depth);
    var index = 0;
    var length = collection.length;

    return {
        friends,
        index,
        next: function (name) {
            var friend = null;
            if (name != undefined) {
                for (var i = 0; i < friends.length; i++) {
                    if (friends[i].name === name) {
                        friend = {name: friends[i].name, phone: friends[i].phone};
                        index = i + 1;
                        break;
                    }
                }
                return friend;
            }
            if (friends.length > index) {
                friend = {name: friends[index].name, phone: friends[index].phone};
                index += 1;
            }
            return friend;
        },
        prev: function () {
            var friend = null;
            index -= 2;
            if (index >= 0 && index < friends.length) {
                friend = {name: friends[index].name, phone: friends[index].phone};
            }
            index += 1;
            return friend;
        },
        nextMale: function () {
            var friend = null;
            var gender = 'Мужской';
            while (index < friends.length) {
                if (friends[index].gender === gender) {
                    friend = {name: friends[index].name, phone: friends[index].phone};
                    index += 1;
                    break;
                } else {
                    index += 1;
                }
            }
            return friend;
        },
        prevMale: function () {
            var friend = null;
            var gender = 'Мужской';
            index -= 2;
            while (index >= 0) {
                if (friends[index].gender === gender) {
                    friend = {name: friends[index].name, phone: friends[index].phone};
                    index += 1;
                    break;
                } else {
                    index -= 1;
                }
            }
            return friend;
        }
    };
};
//делаем список друзей
var getAllFriends = function (collection, startPoint, depth) {
    var listOfFriends = [];//все друзья
    var visitedFriends = [startPoint];//посещаемые друзья
    var check = [];//информация о посещении каждого друга, 1 - посещали, 0 - нет
    var depthCount = [];//глубина для каждого друга, т.е. сколько до него рукопожатий от базового
    var countDepth = 0;//текущая глубина
    var gender;//пол, на случай, если не дали глубину
    if (depth === undefined) {
        depth = Object.keys(collection).length;
        gender = collection[startPoint].gender;
    }
    if (!collection.hasOwnProperty(startPoint) || depth < 0) {
        return listOfFriends;
    }
    check[startPoint] = 1; //говорим, что он чекeром 1, т.е. мы его посетили
    // говорим, что глубина -1 у начального, т.к. сам себе он руку не пожимает
    depthCount[startPoint] = -1;
    while (visitedFriends.length > 0 && countDepth < depth + 1) {
        var used = visitedFriends.shift(); //достаем из посещаемых человека
        var friends = collection[used].friends.sort(); // находим его друзей
        friends.forEach(function (person) {
            if (check[person] != 1) { //если мы его не посещали
                visitedFriends.push(person);//пушим его в посещаемых
                check[person] = 1;//говорим что прошли
                depthCount[person] = depthCount[used] + 1; //даем ему глубину
                countDepth = depthCount[person];//задаем новую глубину
                if (countDepth < depth + 1) {
                    listOfFriends.push({
                        name: person, 
                        phone: collection[person].phone, 
                        gender: collection[person].gender, 
                        count: depthCount[person]});
                }
            }
        });
    }
    if (gender === undefined) {
        return listOfFriends;
    } else {
        var changedListOfFriends = [];
        listOfFriends.forEach(function (person) {
            if (person.gender === gender) {
                changedListOfFriends.push(person);
            }
        });
        return changedListOfFriends;
    }
};
