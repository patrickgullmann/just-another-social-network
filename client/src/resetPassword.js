import { Component } from "react";
import { Link } from "react-router-dom";

export class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            step: 1,
            error: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
        this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
    }

    getCurrentDisplay() {
        const step = this.state.step;
        if (step == 1) {
            return (
                <section>
                    <h1 className="someClass">Password Reset!</h1>
                    {this.state.error && <h3>{this.state.error}</h3>}
                    <form>
                        <input
                            key={1}
                            required
                            name="email"
                            placeholder="Email"
                            type="email"
                            onChange={this.handleChange}
                        ></input>
                        <button onClick={this.handleEmailSubmit}>Submit</button>
                    </form>
                    <Link to="/login">Click here to go back to Login!</Link>
                </section>
            );
        } else if (step == 2) {
            return (
                <section>
                    <h1 className="someClass">Password Reset!</h1>
                    {this.state.error && <h3>{this.state.error}</h3>}
                    <form>
                        <input
                            key={2}
                            required
                            name="code"
                            placeholder="Code"
                            type="text"
                            onChange={this.handleChange}
                        ></input>
                        <input
                            key={3}
                            required
                            name="newPassword"
                            placeholder="New Password"
                            type="password"
                            onChange={this.handleChange}
                        ></input>
                        <button onClick={this.handleCodeSubmit}>Submit</button>
                    </form>
                    <Link to="/login">Click here to go back to Login!</Link>
                </section>
            );
        } else if (step == 3) {
            return (
                <section>
                    <h1 className="someClass">Password Reset!</h1>
                    <p>Done! Sucessfully set new password</p>
                    <Link to="/login">Click here to go back to Login!</Link>
                </section>
            );
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleEmailSubmit(e) {
        e.preventDefault();
        const body = { ...this.state };
        delete body.error;
        delete body.step;

        fetch("/password/reset/start.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((resp) => resp.json())
            .then((response) => {
                if (response.success) {
                    this.setState({
                        step: 2,
                    });
                } else {
                    this.setState({
                        error: "Something went wrong! Please try again.",
                    });
                }
            })
            .catch((err) => {
                console.log("err from sending email reset data: ", err);
                this.setState({
                    error: "Something went wrong! Please try again.",
                });
            });
    }

    handleCodeSubmit(e) {
        e.preventDefault();
        const body = { ...this.state };
        delete body.error;
        delete body.step;

        //email wird ja hier auch mit übergeben! da ja noch in this.state
        //-> weil component ja nicht gewechselt hat (wir haben nur step gewechselt)
        fetch("/password/reset/verify.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((resp) => resp.json())
            .then((response) => {
                if (response.success) {
                    this.setState({
                        step: 3,
                    });
                } else {
                    this.setState({
                        error: "Something went wrong! Please try again.",
                    });
                }
            })
            .catch((err) => {
                console.log("err from sending reset code: ", err);
                this.setState({
                    error: "Something went wrong! Please try again.",
                });
            });
    }

    render() {
        return <>{this.getCurrentDisplay()}</>;
    }
}
