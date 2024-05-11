import { Form, json, redirect } from '@remix-run/react';
import { Box, Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import { CognitoUser, CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';

// Configure the user pool
const userPool = new CognitoUserPool({
  UserPoolId: 'us-east-1_36FZw7fIp',
  ClientId: '24jlv5nsbvts161ign2nl1903k',
});

export let action = async ({ request }: { request: Request }) => {
  // Get the form data
  const formData = new URLSearchParams(await request.text());

  // Extract the email and confirmation code
  const email = formData.get('email');
  const code = formData.get('code');

  // Get the user
  const user = new CognitoUser({ Username: email!, Pool: userPool });

  // Confirm the registration
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code!, true, (err, result) => {
      if (err) {
        // Handle the error
        resolve(json({ error: err.message }, { status: 400 }));
      } else {
        // Redirect the user to the login page
        resolve(redirect('/login'));
      }
    });
  });
};

export default function ConfirmationPage() {

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <Form method="post">
        <VStack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" name="email" required />
          </FormControl>
          <FormControl id="code">
            <FormLabel>Confirmation code</FormLabel>
            <Input type="text" name="code" required />
          </FormControl>
          <Button type="submit" colorScheme="teal">Confirm Registration</Button>
        </VStack>
      </Form>
    </Box>
  );
}