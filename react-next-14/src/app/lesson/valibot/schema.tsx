import * as v from 'valibot';

const USERNAME_REQUIRED_MESSAGE = 'username field is required';
const PASSWORD_REQUIRED_MESSAGE = 'password field is required';

function isValidUsername(){

}

export type FormData = { 
    username: string;
     password: string,
      email: string 
};
const LoginSchema = v.object({
    username: v.pipe(
        v.string('Your username must be a string.'),
        v.nonEmpty('Please enter your username.'),
        v.check(isValidUsername, 'This username is invalid.')

      ),
    email: v.pipe(
      v.string('Your email must be a string.'),
      v.nonEmpty('Please enter your email.'),
      v.email('The email address is badly formatted.')
    ),
    password: v.pipe(
      v.string('Your password must be a string.'),
      v.nonEmpty('Please enter your password.'),
      v.minLength(8, 'Your password must have 8 characters or more.')
    ),
    password2: v.string(),

  });