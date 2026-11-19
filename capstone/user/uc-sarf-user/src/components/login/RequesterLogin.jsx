import { useState } from 'react'
import { loginRequester, registerRequester } from '../../api/auth'

export default function RequesterLogin({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      if (isRegistering) {
        await registerRequester(name, email, password)
        setIsRegistering(false)
        setPassword('')
        setMessage('Account created. Please log in.')
        return
      }

      const requester = await loginRequester(email, password)
      onLogin(requester)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{isRegistering ? 'Create Requester Account' : 'Requester Login'}</h1>

      {isRegistering && (
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
      )}

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <button type="submit">
        {isRegistering ? 'Create Account' : 'Log In'}
      </button>

      <button
        type="button"
        onClick={() => {
          setIsRegistering(!isRegistering)
          setMessage('')
          setError('')
        }}
      >
        {isRegistering ? 'Back to login' : 'Create an account'}
      </button>
    </form>
  )
}