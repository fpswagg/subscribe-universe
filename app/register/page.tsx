'use client'

import { useRouter } from "next/navigation";
import { useState } from "react"

import "@/app/globals.css";
import styles from "@/app/page.module.css"

import { userType, userTypeDB, sessionDataType, useConnection, useObjectServer } from "@/src/connection/connections"

interface errorType {
    message: string;
    temporal: boolean;
    awaiting: string[];
}

import ErrorBox from "@/src/components/formError";

const alphabet = "abcdefghijklmnopqrstuvwxz", digits = "0123456789", symbols = "&é~{}()[]-|è_ç^à=+-/*.,;?:!§%ùµ$¤£¨<>²";
const accepted = alphabet.toLowerCase()+alphabet.toUpperCase()+digits+symbols;

export default function RegisterPage() {
    const [sessionData, setSessionData]: [sessionDataType, Function] = useConnection(sessionStorage);
    const [dbURL, getUsers, checkAccount, getUser, getUsingUser, addUser] = useObjectServer();

    const [username, setUsername]: [string, Function] = useState("");
    const [password, setPassword]: [string, Function] = useState("");
    const [confirm_password, setConfirmPassword]: [string, Function] = useState("");
    const [error, setError]: [errorType, Function] = useState(null);

    const router = useRouter();
    
    return (<form onSubmit={async event => {
        event.preventDefault();

        const user: userType = {username, password};

        const users_db: userTypeDB[] = await getUsers();

        const status: string = checkAccount(user, users_db);

        if (status != "username") {
            setError({message: `The account already exist !`, temporal: true})
            return;
        } else if (filter(username, accepted) != username) {
            setError({message: "Characters for username are not supported !", temporal: true})
            return;
        } else if (filter(password, accepted) != password) {
            setError({message: "Characters for password are not supported !", temporal: true})
            return;
        } else if (password != confirm_password) {
            setError({message: "Confirm the password !", temporal: true})
            return;
        }

        addUser({username: user.username, password: user.password, pastMessages: []}).then(() => {
            let newSessionData: sessionDataType = { user };

            if (sessionData != null) {
                newSessionData = JSON.parse(JSON.stringify(sessionData));

                newSessionData.user = user;

            }

            setSessionData(newSessionData);
            
            router.push("/"+username);

        });
        
    }} className={styles.form}>
        <h1 className={styles.title}>Register to Subscribe Universe</h1>
        { error && <ErrorBox error={error} styles={styles} />}
        <div className={styles.formDivElement}>
            <label>Username: </label>
            <input type="text" value={username} onChange={event => {
                setUsername(event.target.value);
                
                if (filter(event.target.value, accepted) != event.target.value)
                    addError(error, setError, "Characters for username are not supported !");
                else
                    removeError(error, setError, "Characters for username are not supported !");
            }} required />
        </div>
        <div className={styles.formDivElement}>
            <label>Password: </label>
            <input type="password" value={password} onChange={event => {
                setPassword(event.target.value);
                
                if (filter(event.target.value, accepted) != event.target.value)
                    addError(error, setError, "Characters for password are not supported !");
                else
                    removeError(error, setError, "Characters for password are not supported !");
            }} required />
        </div> 
        <div className={styles.formDivElement}>
            <label>Confirm Password: </label>
            <input type="password" value={confirm_password} onChange={event => {
                setConfirmPassword(event.target.value);

                if (password != event.target.value)
                    addError(error, setError, "Confirm the password !");
                else
                    removeError(error, setError, "Confirm the password !");
            }} required />
        </div> 

        <input type="submit" value="Done" />
    </form>)
}

function filter(text: string, fromStr: string) {
    let new_text = "";

    for (let character of text.slice())
        if (fromStr.includes(character))
            new_text += character;
    
    return new_text;
}

function addError(error: errorType, setError: Function, message: string) {
    if (error != null) {
        let error_i = JSON.parse(JSON.stringify(error))! as errorType;

        if (error_i.message != null && !Boolean(error_i.temporal)) {
            if (error_i.awaiting != null)
                error_i.awaiting = [...error_i.awaiting, message];

            else
                error_i.awaiting = [message];
            
        } else
            error_i.message = message;

        error_i.temporal = false;

        setError(error_i);

    } else
        setError({message: message});
    
}

function removeError(error: errorType, setError: Function, message: string) {
    if (error != null) {
        let error_i = JSON.parse(JSON.stringify(error)) as errorType;

        if (error_i.message == message) {
            error_i.message = null;

            if (error_i.awaiting != null?(error_i.awaiting.length > 0):false) {
                error_i.message = error_i.awaiting[0];
                error_i.awaiting.shift();

            }

        } else if (error_i.awaiting != null)
            error_i.awaiting = error_i.awaiting.filter(msg => (msg!=message));

        
        if (error_i.message == null)
            setError(error_i);

        else
            setError(null);

    }
    
}