import { combineReducers } from "redux";
import friendsWannabeesReducer from "./friends-wannabees/slice.js";
import messagesReducer from "./messages/slice.js";
import privateMessagesReducer from "./private-messages/slice.js";

const rootReducer = combineReducers({
    friendsWannabees: friendsWannabeesReducer,
    messages: messagesReducer,
    privateMessages: privateMessagesReducer,
});

export default rootReducer;
