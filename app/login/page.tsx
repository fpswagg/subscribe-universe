'use client'

import { useRouter } from "next/navigation";

import { useState } from "react";

import "@/app/globals.css";
import styles from "@/app/page.module.css";

import { userType, userTypeDB, sessionDataType, useConnection, useObjectServer } from "@/src/connection/connections";

interface errorType {message: string;};

import ErrorBox from "@/src/components/formError";

export default function LoginPage() {
    const [sessionData, setSessionData]: [sessionDataType, Function] = useConnection(sessionStorage);
    const [dbURL, getUsers, checkAccount] = useObjectServer();

    const [username, setUsername]: [string, Function] = useState("");
    const [password, setPassword]: [string, Function] = useState("");
    const [error, setError]: [errorType, Function] = useState(null);

    const router = useRouter();
    
    return (<form onSubmit={async event => {
        event.preventDefault();

        const user: userType = {username, password};

        const users_db: userTypeDB[] = await getUsers();

        const status: string = checkAccount(user, users_db);

        if (status != null) {
            setError({message: `Wrong ${status} !`})
            return;
        }

        let newSessionData: sessionDataType = { user };

        if (sessionData != null) {
            newSessionData = JSON.parse(JSON.stringify(sessionData));

            newSessionData.user = user;

        }

        setSessionData(newSessionData);
        
        router.push("/"+username);

    }} className={styles.form}>
        <h1 className={styles.title}>Login to Subscribe Universe</h1>
        { error && <ErrorBox error={error} styles={styles} />}
        <div className={styles.formDivElement}>
            <label>Username: </label>
            <input type="text" value={username} onChange={event => setUsername(event.target.value)} required />
        </div>
        <div className={styles.formDivElement}>
            <label>Password: </label>
            <input type="password" value={password} onChange={event => setPassword(event.target.value)} required />
        </div> 

        <input type="submit" value="Done" />
    </form>)
}