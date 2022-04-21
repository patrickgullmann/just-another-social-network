// no mutating allowed! -> MAKE COPIES
//note: EGAL WAS ZURÜCK GEGEBEN WIRD WIRD DER NEUE STATE
export default function friendsWannabeesReducer(friendsWannabees = [], action) {
    //console.log(action);
    //console.log(friendsWannabees); //old state

    if (action.type === "friends-wannabees/accepted") {
        friendsWannabees = friendsWannabees.map((friendWannabee) => {
            if (friendWannabee.id == action.payload.otherUserId) {
                friendWannabee = {
                    ...friendWannabee,
                    accepted: true,
                };
            }
            return friendWannabee;
        });
    } else if (action.type === "friends-wannabees/unfriended") {
        friendsWannabees = friendsWannabees.filter((friendWannabee) => {
            if (friendWannabee.id != action.payload.otherUserId) {
                return friendWannabee;
            }
        });
        //SOLLTE AUCH FUNKTIONIEREN
        // friendsWannabees = friendsWannabees.filter(
        //     (friendWannabee) => friendWannabee.id != action.payload.otherUserId
        // );

        // ---> NOW TRY IT INfriendsANDWannabees.js in the state -> if you can rewrite!


        
    } else if (action.type === "friends-wannabees/received") {
        friendsWannabees = action.payload.friendsAndWannabees;
    }
    return friendsWannabees;
}

export function makeFriend(otherUserId) {
    return {
        type: "friends-wannabees/accepted",
        payload: { otherUserId },
    };
}

export function unfriendFriend(otherUserId) {
    return {
        type: "friends-wannabees/unfriended",
        payload: { otherUserId },
    };
}

export function receiveFriendsAndWannabees(friendsAndWannabees) {
    return {
        type: "friends-wannabees/received",
        payload: { friendsAndWannabees },
    };
}
