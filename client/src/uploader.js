import React from "react";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.handleUploadImage = this.handleUploadImage.bind(this);
    }

    handleFileSelection(e) {
        //console.log(e);
        this.file = e.target.files[0];
    }

    handleUploadImage(e) {
        e.preventDefault();

        const fd = new FormData();
        fd.append("file", this.file);
        //console.log(...fd);

        fetch("/upload.json", {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then(({ image_url }) => {
                //to get modal away (got from parent)
                this.props.hideUploader();
                this.props.updateProfilePicture(image_url);
            })
            .catch((err) => {
                console.log("err upload profile picture: ", err);
            });
    }

    render() {
        return (
            <>
                <div className="modal-uploader">
                    <div className="modal-content-uploader">
                        <span
                            className="close-uploader"
                            onClick={this.props.hideUploader}
                        >
                            &times;
                        </span>
                        <p>Please select a Profile Picture and Upload it</p>

                        <form>
                            <input
                                onChange={this.handleFileSelection}
                                type="file"
                                name="file"
                                accept="image/*"
                            />
                            <button onClick={this.handleUploadImage}>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}
