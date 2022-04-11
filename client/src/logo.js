export default function Logo(props) {
    return (
        <>
            <img
                className={props.givenClass ? props.givenClass : null}
                src="/images/logo.png"
                alt="logo"
            />
        </>
    );
}
