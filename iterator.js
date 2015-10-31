	'use strict';

	module.exports.get = function (collection, startPoint, depth) {
		
		var iter = {};
		//если стартовой точки нет в книге
		if (!isNaN(startPoint) || !(collection.hasOwnProperty(startPoint))) {
			var getNull = function() {
				return null;
				}
			iter.getColl = getNull;
			iter.next = getNull;
			iter.nextMale = getNull;
			iter.prevMale = getNull;
			iter.prev = getNull;
			return iter;
			}
		
		//количесвто друзей в книге изначально(надо знать на случай, если вдруг кого-то удалим)
		var primordialLengthPhB = Object.keys(collection).length;
		//список тех, кого мы еще не обошли
		var listOfNext = {};
		//здесь будем хранить тех, кого уже обзвонили
		var listOfPrevious = {};
		listOfPrevious[startPoint] = collection[startPoint];
		//здесь просто список имен, кого уже обзвонили(нужен для prevMale)
		var previous = [];
		previous.push(startPoint);
		//сюда будем записывать друзей контакта
		var listFriends;
		var person; 
		
		//составляем список друзей, кого мы хотим обзвонить
		var makeListFriends = function (collection, startPoint, depth) {
			listOfNext = {};
			var cloneCollection = {};
			for (person in collection) {
				cloneCollection[person] = collection[person];
			}
		
			listFriends = cloneCollection[startPoint].friends;
			delete cloneCollection[startPoint];
			
			//здесь составляем список тех, кого будем обходить на следующем круге
			var nextListFriends = [];
			if (depth == undefined) {
				depth = Number.MAX_SAFE_INTEGER;
			}
			//здесь учитываем добавили ли мы всех кого хотели(если прошлись по всем друзьям друзей)
			var allAdd = 0;
		
			for (var circle = 0; circle <= depth; circle++) {
				for (var j = 0; j < listFriends.length; j++) {	
					if (cloneCollection.hasOwnProperty(listFriends[j]) && !listOfNext.hasOwnProperty(listFriends[j])){
						listOfNext[String(listFriends[j])] = cloneCollection[listFriends[j]];
						nextListFriends = nextListFriends.concat(listOfNext[String(listFriends[j])]['friends'].sort());
						delete cloneCollection[listFriends[j]];
					} else {
						allAdd++;
					}
				}
				if (allAdd === listFriends.length) {
					break;
				}
				listFriends = nextListFriends;
				nextListFriends = [];
				allAdd = 0;
			}
		}
		
		makeListFriends(collection, startPoint, depth);
		
		
		var next = function() {
			//если вдруг из фейсбука кого-то удалили
			if (!(primordialLengthPhB === Object.keys(collection).length)) {
				makeListFriends(collection, startPoint, depth);
				listOfNext[startPoint] = listOfPrevious[startPoint];
				for (person in listOfPrevious) {
					if (listOfNext.hasOwnProperty(person)) {
						delete listOfNext[person];
					}else {
						delete listOfPrevious[person];
						previous.pop();
					}
				}
			}
			//если ищем конкретного человека
			if(!(arguments[0] == 'Мужской') && !(arguments[0] == undefined)) {
				if (listOfNext.hasOwnProperty(arguments[0])) {
					for (person in listOfNext) {
						listOfPrevious[String(person)] = listOfNext[person];
						previous.push(person);
						delete listOfNext[person];
						if (person == arguments[0]) {
							return listOfPrevious[person];
						} 
					} 
				} else {
					return null;
				}
			}
			var guysEnded = true;
			for (var person in listOfNext) {
				listOfPrevious[String(person)] = listOfNext[person];
				previous.push(person);
				delete listOfNext[person];
				if(!(arguments[0] == undefined) && arguments[0] == 'Мужской' && !(listOfPrevious[person].gender == 'Мужской')) {
					continue;
				}
				guysEnded = false;
				return listOfPrevious[person];
			}
			return null;
		}
		
		var prev = function() {
			//если вдруг из фейсбука кого-то удалили
			if (!(primordialLengthPhB === Object.keys(collection).length)) {
				var actPerson = listOfPrevious[previous.pop()];
				makeListFriends(collection, startPoint, depth);
				listOfNext[startPoint] = listOfPrevious[startPoint];
				for (person in listOfPrevious) {
					if (listOfNext.hasOwnProperty(person)) {
						delete listOfNext[person];
					} else {
						delete listOfPrevious[person];
						var index = previous.indexOf(person);
						if (index >= 0) {
							previous.splice(index, 1);
						}
					}
				}
				previous.push(actPerson);
				listOfPrevious[String(actPerson)] = actPerson;
			}
			//если предыдущих больше нет
			if (previous.length < 2) {
				return null;
			} 
			var person = previous.pop();
			listOfNext[String(person)] = listOfPrevious[person];
			delete listOfPrevious[person];
			var person =  previous[previous.length-1];
			return listOfPrevious[person];	
		}
		
		var nextMale = function(name) {
			return next('Мужской');
		}
		
		var prevMale = function() {
			//если вдруг из фейсбука кого-то удалили
			if (!(primordialLengthPhB === Object.keys(collection).length)) {
				var actPerson = listOfPrevious[previous.pop()];
				makeListFriends(collection, startPoint, depth);
				listOfNext[startPoint] = listOfPrevious[startPoint];
				for (person in listOfPrevious) {
					if (listOfNext.hasOwnProperty(person)) {
						delete listOfNext[person];
					} else {
						delete listOfPrevious[person];
						var index = previous.indexOf(person);
						if (index >= 0) {
							previous.splice(index, 1);
						}
					}
				}
				previous.push(actPerson);
				listOfPrevious[String(actPerson)] = actPerson;
			}
			
			//если предыдущих больше нет
			if (previous.length < 2) {
				return null;
			} 			
			var person = previous.pop();
			listOfNext[String(person)] = listOfPrevious[person];
			delete listOfPrevious[person];
			var guysEnded = true;
			for (var i = previous.length-1; i >= 0; i--) {
				var person =  previous[i];
				listOfNext[String(person)] = listOfPrevious[person];
				delete listOfPrevious[person];
				if (listOfNext[person].gender == 'Мужской') {
					guysEnded = false;
					return listOfNext[person];
				}
				previous.pop();
			}
			if (guysEnded) {
				return null;
			}
		}
		
		iter.next = next;
		iter.prev = prev;
		iter.nextMale = nextMale;
		iter.prevMale = prevMale;
		return iter;
	};

