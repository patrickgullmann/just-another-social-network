import { io } from "socket.io-client";
import {
    receiveLastTenMessages,
    receiveMessage,
} from "./redux/messages/slice.js";
import {
    receiveLastTenPrivateMessages,
    receivePrivateMessage,
} from "./redux/private-messages/slice.js";

//der socket für die Client Side
export let socket;

export const init = (store) => {
    if (!socket) {
        console.log("INITIALIZE CONNECTION");
        socket = io.connect();

        socket.on("last-10-messages", (data) => {
            // Update the redux store
            //console.log(data);
            store.dispatch(receiveLastTenMessages(data));
        });

        socket.on("message-to-everybody", (data) => {
            store.dispatch(receiveMessage(data));
        });

        socket.on("send-last-10-private-messages", (data) => {
            // Update the redux store
            console.log(data);
            store.dispatch(receiveLastTenPrivateMessages(data));
        });

        socket.on("private-message-to-me-and-other-user", (data) => {
            store.dispatch(receivePrivateMessage(data));
        });
    }
};
