//note in react the data lives in the outer most component(mother) -> given to children
import React from "react";
import Logo from "./logo";
import ProfilePicture from "./profilePicture";
import Uploader from "./uploader";
import Profile from "./profile";
import FindPeople from "./findPeople";
import OtherProfile from "./otherProfile";

import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

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
        fetch("/user.json")
            .then((resp) => resp.json())
            .then((response) => {
                // quick syntax for adding all to state property
                this.setState(response);
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
            return <h3>Loading ...</h3>;
        }
        return (
            <>
                <BrowserRouter>
                    <header>
                        <Logo givenClass="logoInHeader" />
                        <nav>
                            <Link to="/">Home</Link>
                            <Link to="/users">Find Users</Link>
                        </nav>
                        <ProfilePicture
                            givenClass="profilePictureInHeader"
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.image_url}
                            showUploader={this.showUploader}
                        />
                    </header>

                    <div>
                        <Route exact path="/">
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.image_url}
                                showUploader={this.showUploader}
                                biography={this.state.biography}
                                setBio={this.setBio}
                            />
                        </Route>
                        <Route path="/users">
                            <FindPeople />
                        </Route>
                        <Route exact path="/user/:id">
                            <OtherProfile />
                        </Route>
                    </div>
                </BrowserRouter>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        hideUploader={this.hideUploader}
                        updateProfilePicture={this.updateProfilePicture}
                    />
                )}
            </>
        );
    }
}
