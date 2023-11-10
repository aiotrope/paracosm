import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { toast } from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

import httpService from '../services/http'
import { userKeys, postKeys } from '../services/queryKeyFactory'
import { jwtAtom, expAtom } from '../atoms/store'
import { ObtainRefreshResponse } from '../types/types'

export function useObtainRefresh() {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const setJwt = useSetAtom(jwtAtom)

  const setExp = useSetAtom(expAtom)

  const resetJwt = useResetAtom(jwtAtom)

  const resetExp = useResetAtom(expAtom)

  return useMutation({
    mutationFn: httpService.obtainRefresh,
    onSuccess: (data: ObtainRefreshResponse) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.details() })
      queryClient.invalidateQueries({ queryKey: postKeys.all })

      const decoded = jwtDecode(data.access)

      setJwt((currentValue) => ({
        ...currentValue,
        access: data.access,
        refresh: data.refresh,
      }))

      if (typeof decoded.exp === 'number') setExp(decoded.exp)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(`${error?.response?.data?.error}`)
      resetJwt()
      resetExp()
      localStorage.clear()
      navigate('/login')
    },
  })
}
