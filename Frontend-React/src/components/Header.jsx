import React from 'react'
import Button from './Button'
const Header = () => {
    const loginText = 'Login'
    const regsiterText = 'Register'
    const loginStyle = 'btn btn-outline-info'
    const registerStyle = 'btn btn-info'
    return (
        <>
            <nav className='navbar container pt-3 pb-3 align-items-start'>
                <a className='navbar-brand text-light' href="#">Stock Prediction Portal</a>
                <div>
                    <Button value={{ text: loginText, style: loginStyle }} /> &nbsp;
                    <Button value={{ text: regsiterText, style: registerStyle }} />

                </div>
            </nav>
        </>
    )
}

export default Header