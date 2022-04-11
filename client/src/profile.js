import ProfilePicture from "./profilePicture";
import BioEditor from "./bioEditor";

export default function Profile(props) {
    return (
        <div className="container">
            <h1>This ist the Profile Component of </h1>
            <h1>
                {props.first} {props.last}
            </h1>
            <ProfilePicture
                givenClass="bigPicture"
                first={props.first}
                last={props.last}
                imageUrl={props.imageUrl}
                showUploader={props.showUploader}
            />
            <BioEditor biography={props.biography} setBio={props.setBio} />
        </div>
    );
}

//inside here you want to render first an last name of user
//
