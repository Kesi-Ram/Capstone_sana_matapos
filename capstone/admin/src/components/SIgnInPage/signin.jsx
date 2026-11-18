import React, { useState } from 'react' // Imports React and useState so the component can store and update data
import { signIn } from '../../api/auth' // Imports the function that communicates with the backend to verify login credentials
import './signin.css' // Loads the styles used by this component

export default function SigninPage({ onLogin }) { // Creates the sign-in page and receives a function from the parent to handle successful login

  const [form, setForm] = useState({ email: '', password: '' }) // Stores both input values in one state object so they can be managed together
  const [showPassword, setShowPassword] = useState(false) // Controls password visibility; false means the password is hidden by default
  const [error, setError] = useState('') // Stores error messages so the user knows why the login failed
  const [loading, setLoading] = useState(false) // Tracks the login request to prevent repeated submissions and show loading feedback

  function handleChange(e) { // Reusable function for handling changes in both email and password inputs
    const { name, value } = e.target // Extracts the input's name and value so the function knows which field was changed
    setForm((prev) => ({ ...prev, [name]: value })) // Copies the previous form data and updates only the field that was changed
  }


  async function handleSubmit(e) { // Handles the login process when the user submits the form
    e.preventDefault() // Stops the browser's default form submission because React will handle the login process instead
    setError('') // Clears previous errors so outdated messages do not remain during a new login attempt

    if (!form.email || !form.password) { // Checks if both required credentials have been provided before contacting the backend
      setError('Email and password are required.') // Informs the user that they must complete both fields
      return // Stops execution here because there is no reason to send incomplete credentials
    }

    setLoading(true) // Indicates that a login request is in progress and disables repeated submissions
    try {
      const user = await signIn(form) // Sends the credentials to the backend and waits for authentication before continuing
      onLogin(user) // Passes the authenticated user's data to the parent component so it can update the application's login state
    } catch (err) {
      setError(err.message) // Catches authentication errors and displays the reason returned by the signIn function
    } finally {
      setLoading(false) // Resets the loading state after the request finishes, regardless of success or failure
    }
  }

  return (
    <main className="signin"> {/* Provides the main container that groups the sign-in page content */}
      <h1 className="header">Sign In</h1> {/* Displays the page title so users know which page they are on */}

      <form onSubmit={handleSubmit}> {/* Connects form submission to the login function instead of handling it manually through a button click */}
        <div>
          <label className="email" htmlFor="email">Email:</label> {/* Associates the label with the email input, improving accessibility */}
          <input
            type="email" // Uses the browser's email input validation to help ensure the entered value has a valid email format
            id="email" // Gives the input a unique identifier that the label can reference
            name="email" // Matches the email property in the form state so handleChange updates the correct field
            value={form.email} // Makes React control the input value, keeping what the user sees synchronized with the form state
            onChange={handleChange} // Updates the form state whenever the user types so the latest email is available during submission
          />
        </div>

        <div>
          <label className="password" htmlFor="password">Password:</label> {/* Associates the password label with its corresponding input */}
          <div className="signin__password"> {/* Groups the password field and toggle button so they can be styled together */}
            <input
              type={showPassword ? 'text' : 'password'} // Uses a conditional expression to switch between visible text and hidden password characters
              id="password" // Gives the password input an identifier for its associated label
              name="password" // Matches the password property in the form state so handleChange updates the correct field
              value={form.password} // Keeps the displayed password synchronized with the value stored in React state
              onChange={handleChange} // Updates the password in the form state whenever the user types
            />
            <button
              type="button" // Prevents this button from triggering form submission when the user only wants to show or hide the password
              className="signin__toggle" // Applies the CSS styling for the password visibility button
              onClick={() => setShowPassword((prev) => !prev)} // Reverses the current visibility state without needing a separate function
              aria-label={showPassword ? 'Hide password' : 'Show password'} // Helps screen readers identify the button's current purpose
            >
              {showPassword ? 'Hide' : 'Show'} {/* Changes the button label to match the current password visibility state */}
            </button>
          </div>
        </div>

        {error && <p className="signin__error" role="alert">{error}</p>} {/* Uses conditional rendering to show an error message only when an error exists */}

        <button className="btn" type="submit" disabled={loading}> {/* Submits the login form and prevents clicking while a request is processing */}
          {loading ? 'Signing in...' : 'Sign In'} {/* Gives the user feedback that login is processing instead of leaving the button unchanged */}
        </button>
      </form>
    </main>
  )
}