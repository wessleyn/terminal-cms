'use client'
// FIXME: add this functionality back
// import { checkUserSession } from "@repo/auth"
import { useEffect, useState } from "react"

const useHasSession = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [hasSession, setHasSession] = useState(false)

    useEffect(() => {

        // const checkSession = async () => {
        //     const session = await checkUserSession()
        //    setHasSession(session !== null);
        // }

        // checkSession()
    }, [])

    return hasSession
}

export default useHasSession