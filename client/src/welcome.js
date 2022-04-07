//below we are importing smth not exportet as "default"
import Logo from "./logo";
import { Registration } from "./registration";
import { Login } from "./login";
import { ResetPassword } from "./resetPassword";

import { BrowserRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome to another Social Network!</h1>
            <Logo />
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/reset">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}

// <> is <React.Fragment>
