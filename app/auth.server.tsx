// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/session.server";
import { FormStrategy } from "remix-auth-form";
import { AuthenticationDetails, CognitoAccessToken, CognitoUser, CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";


// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<CognitoAccessToken>(sessionStorage);

// Configure the user pool
const userPool = new CognitoUserPool({
    UserPoolId: 'us-east-1_36FZw7fIp',
    ClientId: '24jlv5nsbvts161ign2nl1903k',
  });

// Tell the Authenticator to use the form strategy
authenticator.use(
    new FormStrategy(async ({ form }) => {
        console.log(form);
        let email = form.get("email");
        let password = form.get("password");
        // Create a new CognitoUser
        let user = new CognitoUser({ Username: email!.toString(), Pool: userPool });

        // Create the authentication details
        let authenticationDetails = new AuthenticationDetails({
            Username: email!.toString(),
            Password: password!.toString(),
        }); 
      // the type of this user must match the type you pass to the Authenticator
      // the strategy will automatically inherit the type if you instantiate
      // directly inside the `use` method
    return new Promise<CognitoAccessToken>((resolve, reject) => {
        user.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                const session = user.getSignInUserSession()?.getAccessToken();
                if (session) {
                    resolve(session);
                } else {
                    reject(new Error("Failed to get user session."));
                }
            },
            onFailure: (err) => {
                reject(err);
            },
        });
    })
    }),
    // each strategy has a name and can be changed to use another one
    // same strategy multiple times, especially useful for the OAuth2 strategy.
    "user-pass"
  );