import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { socket } from "./socket.js";

export default function Chat() {
    //no dispatch/useDispatch here -> we do it in socket.io
    const messages = useSelector((state) => state.messages && state.messages); //state?.messages same
    //console.log("Messages in chat.js: ", messages);

    const [messageText, setMessageText] = useState("");
    //console.log(messageText);

    const chatWindowContainer = useRef();

    useEffect(() => {
        chatWindowContainer.current.scrollTop =
            chatWindowContainer.current.scrollHeight -
            chatWindowContainer.current.clientHeight;
    }, [messages]);

    const submitMessage = () => {
        // Send a message to the server
        socket.emit("message", messageText);
        setMessageText("");
    };

    return (
        <section>
            <h1>Chat to everybody globally!!!</h1>
            <div className="chatWindowContainer" ref={chatWindowContainer}>
                {messages.map((message) => {
                    return (
                        <div className="oneMessage" key={message.message_id}>
                            <section className="oneMessagePicture">
                                <figure className="figureSmallSize">
                                    <img
                                        className="imgSmallSize"
                                        src={
                                            message.image_url ||
                                            "/images/defaultPicture.png"
                                        }
                                        alt={`${message.first} ${message.last}`}
                                    ></img>
                                </figure>
                            </section>
                            <section className="oneMessageNameAndText">
                                <p>
                                    {message.first} {message.last}
                                </p>
                                <p>{message.message}</p>
                            </section>
                        </div>
                    );
                })}
            </div>
            <textarea
                value={messageText}
                placeholder="Drop a nice message ... "
                onChange={(e) => setMessageText(e.target.value)}
            />
            <p></p>
            <button onClick={submitMessage}>Update!</button>
        </section>
    );
}
