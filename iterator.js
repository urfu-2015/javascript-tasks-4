'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var friends = getFriends(collection, startPoint, depth);
    return{
        currentFriend: 0,
        next: function (name) {
            if (currentFriend == 0){
                return null;
            if (name === undefined){
                var friend = getFriendForOut(faceBook, names[currentFriend]);
                this.currentFriend++;
                return friend;
        } else {
            var friend = getFriendForOut(faceBook, name);
            this.currentFriend++;
            return friend;
        }
        prev: function (name) {
            if (currentFriend == 0){
                return null;
            if (name === undefined){
                this.currentFriend--;
                var friend = getFriendForOut(faceBook, names[currentFriend]);
                return friend;
        } else {
            this.currentFriend--;
            var friend = getFriendForOut(faceBook, name);
            return friend;
        }
};

function getFriends(collection, startPoint, depth) {
    var friends = [];
    var names = [startPoint];
    friends.push(collection[startPoint]['friends']);
    function singleName(name){
        var flag = false;
        for (var k = 0; k < names.length; k++){
            if ( name == names[k]){
                flag = true;
            }
        }
        return flag;
    }
    function getFriend(name){
        if (!singleName(name)){
            friends.push(collection[name]['friends'].sort());
            names.push(name);
        }
        return names;
    }
    for (var i=0; i <= depth; i++){
        for (var j = 0; j < friends[i].length; j++){
            getFriend(friends[i][j])
        }
    }
}
function getFriendForOut(faceBook, friendName){
        var input = {name: friendName,
        phone: faceBook[friendName]['phone']};
        return JSON.stringify(input)
}
