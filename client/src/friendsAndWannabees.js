import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { receiveFriendsAndWannabees } from "./redux/friends-wannabees/slice.js";

export default function FriendsAndWannabees() {
    const dispatch = useDispatch();

    const wannabees = useSelector(
        (state) =>
            state.friendsWannabees &&
            state.friendsWannabees.filter((friendship) => !friendship.accepted)
    );

    console.log("wannabees: ", wannabees);

    const friends = useSelector(
        (state) =>
            state.friendsWannabees &&
            state.friendsWannabees.filter((friendship) => friendship.accepted)
    );

    console.log("friends: ", friends);

    // When component mounts, get all friends and wannabees
    useEffect(() => {
        // STEP 1 - make a GET request using fetch to retrieve the friends and wannabees
        // STEP 2 - once you have that data back, call dispatch and pass it an action to add this data to redux
        // you'll need to create and import the action creator below

        // kein if hier -> weil sonst wenn man in Find People unfriended for example
        //dann müsste man dort den state updaten!!! haben wir nicht implementiert
        //deshalb hier immer mounten!!!
        //if (wannabees.length == 0 && friends.length == 0) {
        (async () => {
            const res = await fetch("/api/friends-wannabees");
            const data = await res.json();
            dispatch(receiveFriendsAndWannabees(data));
        })();
    }, []);

    const handleAccept = (id) => {
        console.log(id);
        // STEP 1 - make a POST request to update the DB
        // STEP 2 - dispatch an action to update the global state
        // you'll need to create and import the action creator below
        //dispatch(makeFriend(id));
    };

    return (
        <section>
            <h1>Friends</h1>
            {friends.map((friend) => {
                return (
                    <div key={friend.id}>
                        <button>Unfriend</button>
                    </div>
                );
            })}

            <h1>Wannabees</h1>
            {wannabees.map((wannabee) => {
                return (
                    <div key={wannabee.id}>
                        <button onClick={() => handleAccept(wannabee.id)}>
                            Accept Friend Request
                        </button>
                    </div>
                );
            })}
        </section>
    );
}

// --------------- csl the state ---------------------------

// const wannabees = useSelector((state) => {
//     console.log("here is state", state);
//     return (
//         state.friendsWannabees &&
//         state.friendsWannabees.filter((friendship) => !friendship.accepted)
//     );
// });
