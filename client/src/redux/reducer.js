import { combineReducers } from "redux";
import friendsWannabeesReducer from "./friends-wannabees/slice.js";
import messagesReducer from "./messages/slice.js";

const rootReducer = combineReducers({
    friendsWannabees: friendsWannabeesReducer,
    messages: messagesReducer,
});

export default rootReducer;
