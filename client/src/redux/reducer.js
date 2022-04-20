import { combineReducers } from "redux";
import friendsWannabeesReducer from "./friends-wannabees/slice.js";

const rootReducer = combineReducers({
    friendsWannabees: friendsWannabeesReducer,
});

export default rootReducer;
