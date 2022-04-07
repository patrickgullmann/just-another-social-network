const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1", // Make sure this corresponds to the region in which you have verified your email address (or 'eu-west-1' if you are using the Spiced credentials)
});

//in server.js call this in a POST route(whenever user wants to reset PW)
exports.sendEmail = function (recipient, message, subject) {
    return ses
        .sendEmail({
            //the Source is the email you registered at AWS
            Source: "Patrick Gullmann <heathered.justice@spicedling.email>",
            Destination: {
                //note: normal könnte man an jede senden, aber amazon würde dafür geld verlangen
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise();
    // promise nutzen wir im server!
    // .then(() => console.log("it worked!"))
    // .catch((err) => console.log(err));
};
