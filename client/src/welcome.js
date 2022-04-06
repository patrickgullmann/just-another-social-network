//below we are importing smth not exportet as "default"
import { Registration } from "./registration";
import Logo from "./logo";

export default function Welcome() {
    return (
        <>
            <h1>Welcome!</h1>
            <Logo />
            <Registration />
        </>
    );
}

// <> is <React.Fragment>
