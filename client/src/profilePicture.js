export default function ProfilePicture(props) {
    return (
        <>
            <img
                src={
                    props.imageUrl
                        ? props.imageUrl
                        : "/images/defaultPicture.png"
                }
                alt={`${props.first} ${props.last}`}
                onClick={props.showUploader}
            />
        </>
    );
}
// Andere Option (nicht Tertiäre Operatoren):
// src={props.imageUrl || "/images/defaultPicture.png"}
