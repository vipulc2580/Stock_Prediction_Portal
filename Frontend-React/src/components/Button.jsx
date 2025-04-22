import React from 'react'

const Button = ({ value }) => {
    return (
        <>
            <a className={value.style} href="">{value.text}</a>
        </>
    )
}

export default Button