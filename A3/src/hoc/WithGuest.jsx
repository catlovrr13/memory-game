import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router'

export default function WithGuest(WrappedComponent) {
    function WithGuestWrapper(props){
        const {user, isLoading} = useAuth()

        if (isLoading) return null

        if (user){
            return <Navigate to="/" replace />
        }

        return <WrappedComponent {...props}/>
    }
    return WithGuestWrapper;
}
