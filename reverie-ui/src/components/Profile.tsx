/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import httpService from '../services/http'
import { userKeys, postKeys } from '../services/queryKeyFactory'
import { jwtAtom } from '../atoms/store'
import { User } from '../types/types'

const Profile: React.FC = () => {
  const queryClient = useQueryClient()

  const [userId, setUserId] = React.useState('')

  const jwt = useAtomValue(jwtAtom)

  const decoded: User = jwtDecode(jwt.access)

  const navigate = useNavigate()

  const access = httpService.getAccessToken()

  const resetJwt = useResetAtom(jwtAtom)

  const mutation: any = useMutation({
    mutationFn: async () =>
      await axios.delete(`/api/users/${userId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
      }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: userKeys.detail(userId) })
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      queryClient.invalidateQueries({ queryKey: userKeys.details() })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.details() })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      toast.success(`${userId} successfully deleted`)

      resetJwt()
      localStorage.clear()
      navigate('/login')
    },

    onError: (error: any) => {
      toast.error(`${error?.response?.data?.error}`)
    },
  })

  const handleClickDelete = async (event: any) => {
    event.preventDefault()

    const target = event.target.id

    if (typeof target === 'string') {
      setUserId(target)
      await mutation.mutateAsync(userId)
    }
  }

  return (
    <div>
      <button onClick={handleClickDelete} id={decoded.id}>
        DELETE ACCOUNT
      </button>
    </div>
  )
}

export default Profile
