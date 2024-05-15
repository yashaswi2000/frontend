import { Form, json, redirect } from '@remix-run/react';
import { Box, Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';

// Configure the user pool
const userPool = new CognitoUserPool({
  UserPoolId: 'us-east-1_36FZw7fIp',
  ClientId: '24jlv5nsbvts161ign2nl1903k',
});

export let loader = async ({ request }: { request: Request }) => {
    // Prepare any data for the component
    return json({ message: 'Hello, world!' });
};

export let action = async ({ request }: { request: Request }) => {
    // Get the form data
    const formData = new URLSearchParams(await request.text());

    // Extract the email and password
    const email = formData.get('email');
    const password = formData.get('password');

    // Create the user attributes
    const attributeList: Array<CognitoUserAttribute> = [];
    const dataEmail = {
        Name: 'email',
        Value: email!, // your email here
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    // Register the user
    return new Promise((resolve, reject) => {
        userPool.signUp(email!, password!, attributeList, [], (err, result) => {
            if (err) {
                // Handle the error
                resolve(json({ error: err.message }, { status: 400 }));
            } else {
                // Redirect the user to the confirmation page
                resolve(redirect('/confirm'));
            }
        });
    });
  };

export default function RegisterPage() {

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <Form method="post">
        <VStack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" name="email" required />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" required />
          </FormControl>
          <Button type="submit" colorScheme="teal">Sign Up</Button>
        </VStack>
      </Form>
    </Box>
  );
}