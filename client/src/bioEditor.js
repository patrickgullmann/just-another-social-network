import React from "react";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //dont need these but helps to see what is important here
            textAreaVisible: false,
            draftBio: this.props.biography,
        };
        this.handleBioChange = this.handleBioChange.bind(this);
        this.showTextArea = this.showTextArea.bind(this);
        this.submitBio = this.submitBio.bind(this);
    }

    handleBioChange(e) {
        this.setState({
            draftBio: e.target.value,
        });
    }

    showTextArea() {
        this.setState({
            textAreaVisible: true,
        });
    }

    submitBio(e) {
        e.preventDefault();

        const { draftBio } = this.state;

        fetch("/submit/biography.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ draftBio: draftBio }),
        })
            .then((resp) => resp.json())
            .then(({ biography }) => {
                //console.log(response);
                this.props.setBio(biography);
                this.setState({
                    textAreaVisible: false,
                });
            })
            .catch((err) => {
                console.log("err submitting new bio: ", err);
            });
    }

    render() {
        return (
            <div>
                {!this.state.textAreaVisible && !this.props.biography && (
                    <>
                        <button onClick={this.showTextArea}>Add Bio!</button>
                    </>
                )}
                {!this.state.textAreaVisible && this.props.biography && (
                    <>
                        <p>{this.props.biography}</p>
                        <button onClick={this.showTextArea}>Edit!</button>
                    </>
                )}
                {this.state.textAreaVisible && (
                    <>
                        <textarea
                            value={this.state.draftBio}
                            onChange={this.handleBioChange}
                        />
                        <button onClick={this.submitBio}>Update!</button>
                    </>
                )}
            </div>
        );
    }
}
