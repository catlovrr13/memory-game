import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router'

export default function WithAuth(WrappedComponent) {
    function WithAuthWrapper(props){
        const {user, isLoading} = useAuth()

        if (isLoading) return null

        if (!user){
            return <Navigate to="/register" replace />
        }

        return <WrappedComponent {...props}/>
    }
    return WithAuthWrapper;
}
