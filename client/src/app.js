//note in react the data lives in the outer most component(mother) -> given to children
import React from "react";
import Logo from "./logo";
import ProfilePicture from "./profilePicture";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.hideUploaderByXClick = this.hideUploaderByXClick.bind(this);
    }

    componentDidMount() {
        fetch("/user")
            .then((resp) => resp.json())
            .then((response) => {
                // quick syntax for adding all to state property
                this.setState(response);
                console.log("heyhey", this.state);
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

    hideUploaderByXClick() {
        this.setState({
            uploaderIsVisible: false,
        });
    }

    render() {
        // to allow to wait -> after fetch is done we go below
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
                        hideUploaderByXClick={this.hideUploaderByXClick}
                    />
                )}
            </>
        );
    }
}
