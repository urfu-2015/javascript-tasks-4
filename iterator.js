'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var friends = {};
    var depth = depth || Infinity;
    if (depth > Object.keys(collection).length){
        depth = Object.keys(collection).length;
    }
    if (startPoint in collection) {
        var nextLevelQueue = [];
        var currentLevelQueue = [];
        nextLevelQueue.push(startPoint);
        var levelCounter = 0;
        while (levelCounter <= depth && nextLevelQueue.length > 0) {
            levelCounter++;
            currentLevelQueue = nextLevelQueue;
            nextLevelQueue = [];
            while (currentLevelQueue.length > 0) {
                var currentPoint = currentLevelQueue.shift();
                if (!(currentPoint in friends) && currentPoint !== startPoint) {
                    friends[currentPoint] = collection[currentPoint];
                }
                var friendsToAdd = collection[currentPoint]['friends'];  
                friendsToAdd = friendsToAdd.sort();
                for (var i = 0; i < friendsToAdd.length; i++) {
                    if (!(friendsToAdd[i] in friends) && friendsToAdd[i] !== startPoint) {
                        nextLevelQueue.push(friendsToAdd[i]);
                    }
                }         
            }
        }   
    }

    var stringifyResult = function (position){
         var result = {};
         var personName = orderedFriendsNames[position];
         result.name = personName;
         result.phone = friends[personName]['phone'];
         return (JSON.stringify(result));
    }
    
    var maleIterator = function (direction) {
        var stringifiedPerson = direction();
        while (stringifiedPerson !== null){
            var currentPerson = JSON.parse(stringifiedPerson);
            if(friends[currentPerson.name]['gender'] === 'Мужской'){
                return stringifiedPerson;
            }
            stringifiedPerson = direction();   
        }
        return null;     
    }
    
    var orderedFriendsNames = [];
    for (var friendName in friends) {
        orderedFriendsNames.push(friendName);
    }
    var positionToShow = -1;
    
    return {
        next: function(name) {
            if (positionToShow + 1 >= orderedFriendsNames.length || Object.keys(friends).length == 0){ 
                return null;
            }
            if(name in friends) {
                positionToShow = orderedFriendsNames.indexOf(name);
            } else if (name !== undefined) {
                return null;
            } else {
                positionToShow++;
            }
            return (stringifyResult(positionToShow));
        },
        prev: function(){
            if (positionToShow - 1 < 0 || Object.keys(friends).length == 0) {
                return null;
            }
            positionToShow--;
            return (stringifyResult(positionToShow));
        },
        nextMale: function () {
            return maleIterator(this.next);
        },
        prevMale: function () {
            return maleIterator(this.prev);
        }   
    };  
};

