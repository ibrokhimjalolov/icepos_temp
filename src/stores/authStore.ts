import {computed} from 'vue'
import {defineStore} from 'pinia'
import {getItem, removeItem, setItem} from '@/service/localstorage'
import {useApi} from "@/helpers/axios";

interface ITokens {
    accessToken: string
    refreshToken: string
    username: string
}

export const useAuthStore = defineStore('main', () => {
    const accessToken = getItem('access_token')
    const refreshToken = getItem('refresh_token')
    const username = getItem('username')

    const isAuthenticated = computed(() => {
        return !(!accessToken && !refreshToken)
    })

    const getTokens = computed(() => {
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            username: username
        }
    })

    const logOut = () => {
        removeItem('access_token')
        removeItem('refresh_token')
        window.location.reload()
    }

    const login = (tokens: ITokens) => {
        setItem('access_token', tokens.accessToken)
        setItem('refresh_token', tokens.refreshToken)
        setItem('username', tokens.username)
    }

    return {login, getTokens, logOut, isAuthenticated}
})

export default useAuthStore