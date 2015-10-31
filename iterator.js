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
	
		listFriends = cloneCollection[startPoint]['friends'];
		delete cloneCollection[startPoint];
		//здесь составляем список тех, кого будем обходить на следующем круге
		var nextListFriends = [];
		if (depth == undefined) {
			depth = Number.MAX_SAFE_INTEGER;
		}
		//здесь учитываем добавили ли мы всех кого хотели(если прошлись по всем друзьям друзей)
		var allAdd = 0;
	
		for (var circle = 0; circle < depth; circle++) {
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
	
	//здесь будем хранить тех, кого уже обзвонили
	var listOfPrevious = {};
	//здесь просто список имен, кого уже обзвонили(нужен для prevMale)
	var masPrevious = [];
	
	var next = function(name) {
		//если вдруг из фейсбука кого-то удалили
		if (!(primordialLengthPhB === Object.keys(collection).length)) {
			makeListFriends(collection, startPoint, depth);
			for (person in listOfPrevious) {
				if (listOfNext.hasOwnProperty(person)) {
					delete listOfNext[person];
				}else {
					delete listOfPrevious[person];
					masPrevious.pop();
				}
			}
		}
		//если ищем конкретного человека
		if(!(name == undefined)) {
			if (listOfNext.hasOwnProperty(name)) {
				person = name+' '+listOfNext[name]['phone'];
				delete listOfNext[name];
				return  person;
			} else {
				return null;
			}
		}
		for (var person in listOfNext) {
			listOfPrevious[String(person)] = listOfNext[person];
			masPrevious.push(person);
			delete listOfNext[person];
			return person+'  '+listOfPrevious[person]['phone'];
		}
		return null;
	}
	
	var prev = function() {
		//если вдруг из фейсбука кого-то удалили
		if (!(primordialLengthPhB === Object.keys(collection).length)) {
			makeListFriends(collection, startPoint, depth);
			for (person in listOfPrevious) {
				if (listOfNext.hasOwnProperty(person)) {
					delete listOfNext[person];
				} else {
					delete listOfPrevious[person];
					var index = masPrevious.indexOf(person);
					if (index >= 0) {
						masPrevious.splice(index, 1);
					}
				}
			}
		}
		//если предыдущих больше нет
		if (masPrevious.length < 2) {
			return null;
		} 
		var person = masPrevious.pop();
		var prevPerson =  masPrevious[masPrevious.length-1];
		listOfNext[String(person)] = listOfPrevious[person];
		delete listOfPrevious[person];
		return prevPerson+'  '+listOfPrevious[prevPerson]['phone'];	
	}
	
	var nextMale = function(name) {
		//если вдруг из фейсбука кого-то удалили
		if (!(primordialLengthPhB === Object.keys(collection).length)) {
			makeListFriends(collection, startPoint, depth);
			for (person in listOfPrevious) {
				if (listOfNext.hasOwnProperty(person)) {
					delete listOfNext[person];
				} else {
					delete listOfPrevious[person];
					masPrevious.pop();
				}
			}
		}
		//если ищем конкретного человека
		if(!(name == undefined)) {
			if (listOfNext.hasOwnProperty(name)) {
				delete listOfNext[name];
				return name+'  '+listOfPrevious[name]['phone'];
			} else {
				return null;
			}
		}
		
		var guysEnded = true;
		for (var person in listOfNext) {
			if (listOfNext[person]['gender'] == 'Мужской') {
				guysEnded = false;
				listOfPrevious[String(person)] = listOfNext[person];
				masPrevious.push(person);
				delete listOfNext[person];
				return person+'  '+listOfPrevious[person]['phone'];
			}
		}
		if (guysEnded) {
			return null;
		}
	}
	
	var prevMale = function() {
		//если вдруг из фейсбука кого-то удалили
		if (!(primordialLengthPhB === Object.keys(collection).length)) {
			makeListFriends(collection, startPoint, depth);
			for (person in listOfPrevious) {
				if (listOfNext.hasOwnProperty(person)) {
					delete listOfNext[person];
				} else {
					delete listOfPrevious[person];
					var index = masPrevious.indexOf(person);
					if (index >= 0) {
						masPrevious.splice(index, 1);
					}
				}
			}
		}
		//если предыдущих больше нет
		if (masPrevious.length < 1) {
			return null;
		} 
		
		var person = masPrevious.pop();
		listOfNext[String(person)] = listOfPrevious[person];
		delete listOfPrevious[person];
		var guysEnded = true;
		for (var i = masPrevious.length-1; i >= 0; i--) {
			var prevPerson =  masPrevious[i];
			if (listOfPrevious[prevPerson]['gender'] == 'Мужской') {
				guysEnded = false;
				return prevPerson+' '+listOfPrevious[prevPerson]['phone'];
			}
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

