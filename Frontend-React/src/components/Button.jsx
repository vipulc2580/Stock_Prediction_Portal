import React from 'react'
import { Link } from 'react-router-dom'
const Button = ({ value }) => {
    return (
        <>
            <Link className={value.style} to={value.url}>{value.text}</Link>
        </>
    )
}

export default Button