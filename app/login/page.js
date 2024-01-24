'use client'

import { useRouter } from "next/navigation";

import { useState } from "react"

import "@/app/globals.css";
import styles from "@/app/page.module.css"

import { useConnection } from "@/src/connection/connections"
import ErrorBox from "@/src/components/formError";

export default function LoginPage() {
    const [sessionData, setSessionData] = useConnection();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); //{ message: ... }

    const router = useRouter();
    
    return (<form onSubmit={event => {
        event.preventDefault();

        const user = {username, password};

        //if user does not exist, say
        //if password is wrong, say.

        let newSessionData = { user };

        if (sessionData != null) {
            newSessionData = JSON.parse(JSON.stringify(sessionData));

            if (newSessionData.user == undefined)
                Object.bind(newSessionData, user);

            else
                newSessionData.user = user;

        }

        setSessionData(newSessionData);
        
        router.push("/");

    }} className={styles.form}>
        <h1 className={styles.title}>Login to Subscribe Universe</h1>
        { error && <ErrorBox error={error} />}
        <div className={styles.formDivElement}>
            <label>Username: </label>
            <input type="text" value={username} onChange={event => setUsername(event.target.value)} />
        </div>
        <div className={styles.formDivElement}>
            <label>Password: </label>
            <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
        </div> 

        <input type="submit" value="Done" />
    </form>)
}