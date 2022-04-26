import { useState, useEffect } from "react";

//getting props from otherProfile!
export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        fetch(`/api/friendship/${props.otherUserId}`)
            .then((resp) => resp.json())
            .then((response) => {
                if (response.length === 0) {
                    setButtonText("Send Friend Request");
                    return;
                }

                const [friendship] = response;

                if (friendship.accepted) {
                    setButtonText("Unfriend");
                } else {
                    if (friendship.recipient_id == props.otherUserId) {
                        //-> ich bin auf otherUser Side und er ist recipient -> ich habe gesendet
                        setButtonText("Cancel Friend Request");
                    } else {
                        setButtonText("Accept Friend Request");
                    }
                }
            });
    }, []);

    const handleSubmit = () => {
        fetch("/api/friendship-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otherUserId: props.otherUserId,
                action: buttonText,
            }),
        })
            .then((resp) => resp.json())
            .then((response) => {
                //bc in server we define what button will be set!!
                setButtonText(response);
                if (response == "Unfriend") {
                    //actually the click is done below
                    props.clickToAllowPrivateChat();
                } else if (response == "Send Friend Request") {
                    //actually the click is done below
                    props.clickToDisablePrivateChat();
                }
            });
    };

    return (
        <button className="friendButton" onClick={handleSubmit}>
            {buttonText}
        </button>
    );
}
