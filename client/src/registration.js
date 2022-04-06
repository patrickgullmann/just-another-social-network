import { Component } from "react";

export class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log("Yeah it mounted");
    }

    handleChange(e) {
        //just dynamic adding of a property to the state obj
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        //anstatt JSON.stringify(this.state) senden wo error immer mitgesendet wird
        const body = { ...this.state };
        delete body.error;

        fetch("/register.json", {
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
                        error: "Something went wrong: All fields are filled out? Email already taken?",
                    });
                }
            })
            .catch((err) => {
                console.log("err from sending registration data: ", err);
                this.setState({
                    error: "Something went wrong: Sending data to server",
                });
            });
    }

    render() {
        return (
            <section>
                <h1 className="someClass">Registration!</h1>
                {this.state.error && <h2>{this.state.error}</h2>}
                <form>
                    <input
                        required
                        name="first"
                        placeholder="First Name"
                        type="text"
                        onChange={this.handleChange}
                    ></input>
                    <input
                        required
                        name="last"
                        placeholder="Last Name"
                        type="text"
                        onChange={this.handleChange}
                    ></input>
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
                    <button onClick={this.handleSubmit}>Register!</button>
                </form>
            </section>
        );
    }
}

//need constructor bc we have a class!
//need super(); that we have access to all methods etc from Component

/* ------------------------------------- long code and nice destructure ----- */
//  handleChange(e) {
//         // e.target.value destructured and renamed
//         //let { value: val } = e.target;

//         //just dynamic adding of a property to an obj
//         this.setState(
//             {
//                 [e.target.name]: e.target.value,
//             },
//             () => console.log("done!", this.state)
//         );
//     }
