import { Component } from "react";
import { Link } from "react-router-dom";

export class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const body = { ...this.state };
        delete body.error;

        fetch("/login.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((resp) => resp.json())
            .then((response) => {
                if (response.success) {
                    location.reload();
                } else {
                    this.setState({
                        error: "Something went wrong! Please try again.",
                    });
                }
            })
            .catch((err) => {
                console.log("err from sending registration data: ", err);
                this.setState({
                    error: "Something went wrong! Please try again.",
                });
            });
    }

    render() {
        return (
            <section>
                <h1 className="someClass">Login!</h1>
                {this.state.error && <h3>{this.state.error}</h3>}
                <form>
                    <input
                        required
                        name="email"
                        placeholder="Email"
                        type="email"
                        onChange={this.handleChange}
                    ></input>
                    <input
                        required
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={this.handleChange}
                    ></input>
                    <button onClick={this.handleSubmit}>Login!</button>
                </form>
                <Link to="/">
                    <button>Click here to Register!</button>
                </Link>
                <Link to="/reset">Did you forget your Password?</Link>
            </section>
        );
    }
}
