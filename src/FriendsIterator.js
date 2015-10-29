export const GO_FORWARD = 'GO_FORWARD';
export const GO_BACKWARD = 'GO_BACKWARD';

export default function * FriendsIterator(collection, rootID, deep = 3) {

    const backStepSize = 2;
    const marked = new Set([rootID]);
    const levels = new Array(deep).fill(null).map(()=>[]);
    const root = collection[rootID] || null;
    const rootChildren = root ? [...root.friends] : [];
    levels[0] = rootChildren.sort();

    let direction = GO_FORWARD;
    let result = {name: rootID, ...root};
    let level = 0;
    let index = 0;
    let backSteps = backStepSize;


    while (true) {

        if (result !== undefined) {
            direction = (yield result) || GO_FORWARD;
            backSteps = backStepSize;
            result = undefined;
        }

        switch (direction) {
            case GO_FORWARD:
                if (index == levels[level].length) {
                    if (level < deep - 1) {
                        level++;
                        index = 0;
                    } else {
                        result = null;
                    }
                } else {
                    const nextId = levels[level][index];

                    if (!marked.has(nextId) && (level < deep - 1)) {
                        const friends = collection[nextId].friends.filter(
                            id => !marked.has(id)
                        );
                        levels[level + 1].push(...friends);
                    }

                    result = {
                        name: nextId,
                        ...collection[nextId]
                    };

                    index++;
                }
                break;

            case GO_BACKWARD:

                if (!backSteps) {
                    direction = GO_FORWARD;
                } else {
                    if (index == 0) {
                        if (level > 0) {
                            index = levels[--level].length - 1;
                            backSteps--;
                        } else {
                            result = null;
                        }
                    } else {
                        index--;
                        backSteps--;
                    }
                }
                break;
        }
    }
}
