import ProfilePicture from "./profilePicture";
import BioEditor from "./bioEditor";

export default function Profile(props) {
    return (
        <div className="container">
            <h1>This is MY Profile Component of </h1>
            <h1>
                {props.first} {props.last}
            </h1>
            <figure className="figureBigSize">
                <ProfilePicture
                    givenClass="imgBigSize"
                    first={props.first}
                    last={props.last}
                    imageUrl={props.imageUrl}
                    showUploader={props.showUploader}
                />
            </figure>
            <BioEditor biography={props.biography} setBio={props.setBio} />
        </div>
    );
}
