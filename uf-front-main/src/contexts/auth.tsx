import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"
import { Loader } from "../components/Loader"
import { UserInterface } from "../interfaces"
import { getMe } from "../utils/requests/auth"

const AuthContext = createContext<{
    user: UserInterface | null
    refreshUser: () => void
}>({
    user: null,
    refreshUser: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = (props: any) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<UserInterface | null>(null)

    const refreshUser = useCallback(async () => {
        await getMe().then(setUser)
    }, [])
    useEffect(() => {
        refreshUser().then(() => setLoading(false))
    }, [refreshUser])

    return (
        <AuthContext.Provider
            value={{
                user,
                refreshUser,
            }}
        >
            {loading ? <Loader /> : props.children}
        </AuthContext.Provider>
    )
}
