// this is our friends-wannabees sub-reducer
// in here- we MUST make copies for every array and object
// no mutating allowed!

//note: EGAL WAS ZURÜCK GEGEBEN WIRD WIRD DER NEUE STATE
export default function friendsWannabeesReducer(friendsWannabees = [], action) {
    console.log(action);
    console.log(friendsWannabees); //old state

    if (action.type === "friends-wannabees/accept") {
        // const newFriendsWannabees = friendsWannabees.map( do your logic here)
        // return newFriendsWannabees;
    } else if (action.type === "friends-wannabees/received") {
        friendsWannabees = action.payload.friendsAndWannabees;
    }
    return friendsWannabees;
}

export function makeFriend(id) {
    return {
        type: "friends-wannabees/accept",
        payload: { id },
    };
}

export function receiveFriendsAndWannabees(friendsAndWannabees) {
    return {
        type: "friends-wannabees/received",
        payload: { friendsAndWannabees },
    };
}
