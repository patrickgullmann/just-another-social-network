import { useState } from "react";

//note sometimes (e.g. for buttons) you want to pass also agruments to the funktion
export function useForm() {
    const [values, setValues] = useState({});

    const handleChange = (e) =>
        setValues({
            //need to copy existing bc it does not "Shadowing" like this.setState
            ...values,
            [e.target.name]: e.target.value,
        });

    return [values, handleChange];
}

// ------------------ NOTE -------------------------------------------
//You can just use this in funktion components! not class components!
//------------------->>> MEANING:
//if you want to use this you have to change e.g. login and two options:
//1. make login to normal function + you have to make a button also a hook OR
//2. make login to function and a hook + just use button as before
