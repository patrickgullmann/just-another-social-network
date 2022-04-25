export default function privateMessagesReducer(privateMessages = [], action) {
    //console.log(action);
    //console.log(messages); //old state

    if (action.type === "privateMessages/received") {
        privateMessages = action.payload.lastTenPrivateMessages;
    } else if (action.type === "onePrivateMessage/received") {
        privateMessages = [...privateMessages, action.payload.privateMessage];
    }
    return privateMessages;
}

export function receiveLastTenPrivateMessages(lastTenPrivateMessages) {
    return {
        type: "privateMessages/received",
        payload: { lastTenPrivateMessages },
    };
}

export function receivePrivateMessage(privateMessage) {
    return {
        type: "onePrivateMessage/received",
        payload: { privateMessage },
    };
}
