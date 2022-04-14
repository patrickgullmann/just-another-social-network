import { useState } from "react";

//also want to pass arguments (maybe they come from some props)
export function useHandleSubmit(url, values) {
    const [error, setError] = useState();

    const handleSubmit = () => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) =>
                data.success ? location.replace("/") : setError(true)
            );
    };

    return [error, handleSubmit];
}
