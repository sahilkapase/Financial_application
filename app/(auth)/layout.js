import React from 'react'
const AuthLayout = ({ children }) => {
    return (
        <div className='flex justify-center items-center h-screen pt-22 '>

            {children}
        </div>
    )
}

export default AuthLayout
