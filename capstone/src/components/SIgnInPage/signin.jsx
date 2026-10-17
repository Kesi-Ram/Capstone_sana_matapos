
import React, { useState } from 'react'
import './signin.css'


function Signin() {

  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="signin">
      <h1 className='header'>Sign In</h1>
      <form>
        <div>
          <label className="email" htmlFor="email">Email:</label>
          <input type="email" id="email" />
        </div>

         <div>
          <label className="password" htmlFor="password">Password:</label>
          <div className="signin__password">
            <input type={showPassword ? 'text' : 'password'} id="password"/>
            <button type="button" className="signin__toggle" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button className="btn" type="submit">Sign In</button>
      </form>
    </main>
  )
}

export default Signin