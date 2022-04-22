export default function messagesReducer(messages = [], action) {
    //console.log(action);
    //console.log(messages); //old state

    if (action.type === "messages/received") {
        messages = action.payload.lastTenMessages;
    } else if (action.type === "oneMessage/received") {
        messages = [...messages, action.payload.message];
    }
    return messages;
}

export function receiveLastTenMessages(lastTenMessages) {
    return {
        type: "messages/received",
        payload: { lastTenMessages },
    };
}

export function receiveMessage(message) {
    return {
        type: "oneMessage/received",
        payload: { message },
    };
}
