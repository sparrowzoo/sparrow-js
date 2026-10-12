"use client";

import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import CrosStorage from "@/common/lib/CrosStorage";
import LoginUser from "@/common/lib/protocol/LoginUser";

export type LoginUserStatus = "loading" | "ready" | "error";

export interface LoginUserState {
    user: LoginUser | null;
    status: LoginUserStatus;
    refresh: () => void;
}

const LoginUserContext = createContext<LoginUserState | null>(null);

export function LoginUserProvider({children}: Readonly<{ children: React.ReactNode }>) {
    const [state, setState] = useState<{ user: LoginUser | null; status: LoginUserStatus }>({
        user: null,
        status: "loading",
    });
    const storageRef = useRef<CrosStorage | null>(null);
    const mounted = useRef(true);

    const load = useCallback(() => {
        if (!storageRef.current) {
            storageRef.current = CrosStorage.getCrosStorage();
        }
        const storage = storageRef.current;
        storage.getCurrentUser()
            .then((user) => {
                if (!mounted.current) return;
                // null means a credential exists but cannot be localized; treat as unreadable.
                setState(user ? {user, status: "ready"} : {user: null, status: "error"});
            })
            .catch(() => {
                if (!mounted.current) return;
                setState({user: null, status: "error"});
            });
    }, []);

    useEffect(() => {
        mounted.current = true;
        load();
        const unsubscribe = CrosStorage.onTokenChange(load);
        return () => {
            mounted.current = false;
            unsubscribe();
            storageRef.current?.destroy();
            storageRef.current = null;
        };
    }, [load]);

    const refresh = useCallback(() => {
        setState({user: null, status: "loading"});
        load();
    }, [load]);

    return (
        <LoginUserContext.Provider value={{user: state.user, status: state.status, refresh}}>
            {children}
        </LoginUserContext.Provider>
    );
}

export function useLoginUser(): LoginUserState {
    const context = useContext(LoginUserContext);
    if (!context) {
        throw new Error("useLoginUser must be used within a LoginUserProvider");
    }
    return context;
}

export default LoginUserProvider;
