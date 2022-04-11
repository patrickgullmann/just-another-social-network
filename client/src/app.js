//note in react the data lives in the outer most component(mother) -> given to children
import React from "react";
import Logo from "./logo";
import ProfilePicture from "./profilePicture";
import Uploader from "./uploader";
import Profile from "./profile";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.updateProfilePicture = this.updateProfilePicture.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        fetch("/user")
            .then((resp) => resp.json())
            .then((response) => {
                // quick syntax for adding all to state property
                this.setState(response);
                window.history.pushState(
                    "",
                    "",
                    `${this.state.first}${this.state.last}`.toLowerCase()
                );
            })
            .catch((err) => {
                console.log("err from getting user data: ", err);
            });
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true,
        });
    }

    hideUploader() {
        this.setState({
            uploaderIsVisible: false,
        });
    }

    updateProfilePicture(updatedUrl) {
        this.setState({
            image_url: updatedUrl,
        });
    }

    setBio(newBio) {
        this.setState({
            biography: newBio,
        });
    }

    render() {
        if (!this.state.id) {
            return <h3>Loading ... </h3>;
        }
        return (
            <>
                <Logo />
                <ProfilePicture
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.image_url}
                    showUploader={this.showUploader}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        hideUploader={this.hideUploader}
                        updateProfilePicture={this.updateProfilePicture}
                    />
                )}
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.image_url}
                    showUploader={this.showUploader}
                    biography={this.state.biography}
                    setBio={this.setBio}
                />
            </>
        );
    }
}
