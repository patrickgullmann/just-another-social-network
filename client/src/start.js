import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Logo from "./logo";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        //we have two single pages! -> one for logged out users
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            //and one for logged in users
            ReactDOM.render(<Logo />, document.querySelector("main"));
        }
    });
