'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Message, User } from '@/model/User'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { Button } from '@react-email/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'

const page = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch("acceptMessage")

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-message')
            setValue("acceptMessage", response.data.isAcceptingMessages || false)


        } catch (error) {
            console.error("Error accepting messages:", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || 'An error occurred while fetching accept message status.')
        }
        finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean) => {
        setIsLoading(true)
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast.success('Messages refreshed successfully!', { description: `You have ${response.data.messages?.length || 0} new messages.` })
            }
        } catch (error) {
            console.error("Error fetching messages:", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || 'An error occurred while fetching messages.')
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages(true)
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    // handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-message', {
                acceptMessage: !acceptMessages
            })
            setValue("acceptMessage", !acceptMessages)
            toast.success(response.data.message, { description: `You are now ${!acceptMessages ? 'accepting' : 'not accepting'} messages.` })
        } catch (error) {
            console.error("Error updating accept message:", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast.error('An error occurred while updating accept message status.', { description: axiosError.response?.data.message || 'Failed to fetch message settings' })
        }
    }

    if( !session || !session.user) {
        return <div>Please login</div>
    }

    const { username } = session?.user as User
    // do research about base url in nextjs
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success('URL copied to clipboard!', {
            description: "Profile URL copied successfully."
        })
    }

    if (!session || !session.user) {
        return <div>Please login</div>
    }

    return (
        <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <div className="mb-4">
                <h2 className='text-4xl font-semibold mb-2'>Copy your Unique Link</h2>
                <div className="flex items-center">
                    <input type="text" readOnly value={profileUrl} className='input input-borderer w-full p-2 mr-2' disabled />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register("acceptMessage")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                onClick={(e) => { e.preventDefault(); fetchMessages(true); }}
            >
                {isLoading ? (<Loader2 className="h-4 w-4 animate-spin" />) : (<RefreshCcw className="h-4 w-4" />)}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (messages.map((message, index) => (
                    <MessageCard
                        key={String(message._id)}
                        message={message}
                        onMessageDelete={handleDeleteMessage}
                    />))
                ) : (
                    <p>No messages found.</p>
                )}
            </div>
        </div>
    )
}

export default page