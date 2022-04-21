import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    //console.log(users); //csl here bc of async

    useEffect(() => {
        let abort = false;

        //using querystrings to make just one fetch instead
        //of two where one has no search term and one hasnt
        fetch(`/api/find-users?search=${searchTerm}`)
            .then((resp) => resp.json())
            .then((response) => {
                if (!abort) {
                    setUsers(response);
                    //note: setUsers etc macht nicht wie this.setState ein "Shadowing"
                    // ----> dh wenn man all vorheriges haben will ...response inside machen + neues adden
                }
            });

        return () => (abort = true);
    }, [searchTerm]);

    return (
        <section id="findPeople">
            <h1>Finding People Section</h1>
            <input
                placeholder="Enter name"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div id="userContainer">
                {!searchTerm && <h3>Most recently joined users: </h3>}
                {searchTerm && <h3>Your search result: </h3>}
                {users.map((user) => (
                    <div key={user.id}>
                        <Link to={`/user/${user.id}`}>
                            <figure className="figureMediumSize">
                                <img
                                    className="imgMediumSize"
                                    src={
                                        user.image_url
                                            ? user.image_url
                                            : "/images/defaultPicture.png"
                                    }
                                    alt={`${user.first} ${user.last}`}
                                />
                            </figure>
                        </Link>
                        {user.first} {user.last}
                    </div>
                ))}
            </div>
        </section>
    );
}
