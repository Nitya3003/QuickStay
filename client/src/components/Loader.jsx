import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Loader = () => {
    const { navigate, axios } = useAppContext()
    const { nextUrl } = useParams()
    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const sessionId = params.get('session_id')

        const confirmPayment = async () => {
            try {
                if (sessionId) {
                    await axios.post('/api/bookings/stripe-payment/confirm', { session_id: sessionId })
                }
            } catch (error) {
                toast.error(error.message)
            } finally {
                // Navigate regardless, so the page refreshes bookings
                navigate(`/${nextUrl}`)
            }
        }

        if (nextUrl) {
            confirmPayment()
        }
    }, [nextUrl, location.search])

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary'></div>
        </div>
    )
}

export default Loader