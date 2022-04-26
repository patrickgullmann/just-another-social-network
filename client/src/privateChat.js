import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { socket } from "./socket.js";

//updated nicht für friendbutton change -> müsste refreshen! (lösung über otherprofile state einführen
// und funktion an Friendbutton geben, die state von parent holt und hier abrufen)
export default function PrivateChat(props) {
    const [allowed, setAllowed] = useState(false);

    const privateMessages = useSelector(
        (state) => state.privateMessages && state.privateMessages
    );

    const [privateMessageText, setPrivateMessageText] = useState("");
    console.log(privateMessageText);

    const chatWindowContainer = useRef();

    useEffect(() => {
        fetch(`/api/check-private-chat-allowed/${props.otherUserId}`)
            .then((resp) => resp.json())
            .then((response) => {
                setAllowed(response.allowed);
                if (response.allowed) {
                    socket.emit("get-last-10-private-messages", {
                        otherUserId: props.otherUserId,
                    });
                }
            })
            .catch((err) => {
                console.log("err from checking private chat allowed: ", err);
            });
    }, []);

    useEffect(() => {
        if (allowed) {
            chatWindowContainer.current.scrollTop =
                chatWindowContainer.current.scrollHeight -
                chatWindowContainer.current.clientHeight;
        }
    }, [privateMessages]);

    const submitPrivateMessage = () => {
        // Send a message to the server
        socket.emit("send-private-message", {
            privateMessageText,
            otherUserId: props.otherUserId,
        });
        setPrivateMessageText("");
    };

    if (!allowed) {
        return <></>;
    }
    return (
        <section className="otherProfileMessages">
            <h1>
                Private Chat to {props.otherUserFirst} {props.otherUserLast}
            </h1>
            <div className="chatWindowContainer" ref={chatWindowContainer}>
                {privateMessages.map((privateMessage) => {
                    // first last is always from the sender!
                    return (
                        <div
                            className="oneMessage"
                            key={privateMessage.message_id}
                        >
                            <section className="oneMessagePicture">
                                <figure className="figureSmallSize">
                                    <img
                                        className="imgSmallSize"
                                        src={
                                            privateMessage.image_url ||
                                            "/images/defaultPicture.png"
                                        }
                                        alt={`${privateMessage.first} ${privateMessage.last}`}
                                    ></img>
                                </figure>
                            </section>
                            <section className="oneMessageNameAndText">
                                <p>
                                    {privateMessage.first} {privateMessage.last}
                                </p>
                                <p>{privateMessage.message}</p>
                            </section>
                        </div>
                    );
                })}
            </div>
            <textarea
                value={privateMessageText}
                placeholder="Drop a nice message ... "
                onChange={(e) => setPrivateMessageText(e.target.value)}
            />
            <button onClick={submitPrivateMessage}>Update!</button>
        </section>
    );
}
