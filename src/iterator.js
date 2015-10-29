import friendsIterator, {GO_BACKWARD} from './FriendsIterator';

export const get = function (collection, startPoint, depth) {
    const it = friendsIterator(collection, startPoint, depth);
    it.next();
    return new GenderIterator(it);
};

const filterByName = name => obj => obj.name === name;
const filterByGender = gender => obj => obj.gender === gender;

const always = () => true;

const findBy = (filterFn, next) => {
    let result;
    while (result = next().value) {
        if (filterFn(result)) {
            break;
        }
    }
    return result;
};

class GenderIterator {
    constructor(iterator) {
        this.iterator = iterator;
    }

    next(name) {
        var it = this.iterator;
        return findBy(!name ? always : filterByName(name), it::it.next);
    }

    prev(name) {
        var it = this.iterator;
        return findBy(!name ? always : filterByName(name),
            it.next.bind(it, GO_BACKWARD));
    }

    nextMale() {
        var it = this.iterator;
        return findBy(filterByGender('Мужской'), it::it.next);
    }

    prevMale() {
        var it = this.iterator;
        return findBy(filterByGender('Мужской'), it.next.bind(it, GO_BACKWARD));
    }

}
