import { io } from "socket.io-client";
import {
    receiveLastTenMessages,
    receiveMessage,
} from "./redux/messages/slice.js";

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
    }
};
