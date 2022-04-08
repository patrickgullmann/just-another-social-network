import React from "react";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        //
    }

    render() {
        return (
            <>
                <div className="modal-uploader">
                    <div className="modal-content-uploader">
                        <span
                            className="close-uploader"
                            onClick={this.props.hideUploaderByXClick}
                        >
                            &times;
                        </span>
                        <p>Some text in the Modal..</p>
                    </div>
                </div>
            </>
        );
    }
}
