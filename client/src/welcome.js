//below we are importing smth not exportet as "default"
import { Registration } from "./registration";
import { Login } from "./login";
import Logo from "./logo";

import { BrowserRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>
            <Logo />
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}

// <> is <React.Fragment>
