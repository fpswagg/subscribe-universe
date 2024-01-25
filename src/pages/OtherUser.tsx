'use client'

import React, { useEffect, useState } from 'react'
import { messageType, useObjectServerType, userType, userTypeDB } from '../connection/connections'

export default function OtherUserPage( {
        userDB, currentUserDB, usersDB, useObjectServer, styles
    } : {
        userDB: userTypeDB, currentUserDB: userTypeDB, usersDB: userTypeDB[], useObjectServer: useObjectServerType, styles: any
    }) {
        const [messages, setMessages] = useState(null);
        const [url, getUsers, checkAccount, getUser, getUsingUser, addUser, removeUser, getMessages, makeMessage, addMessage] = useObjectServer;

        useEffect(() => {
            getMessages(currentUserDB).then(([recieved, sent]) => {
                setMessages([...recieved.filter(a=>a[1]==userDB).map(a=>a[0]),
                ...sent.filter(a=>a.toID==userDB.id)].sort((msg1, msg2) => msg1[0].date - msg2[0].date)
                .map(message => {
                    return (<li key={Date.now()} className={(sent.includes(message)?"sentMsg ":"")+"message"}>{message.content}</li>);
                }));
            });
        }, []);

        return (<>
            <h1 className={styles.title}>{userDB.username}</h1>
            <ul>
                {messages || (<li>No Message</li>)} 
            </ul>
            <button onClick={async () => {
                await addMessage(makeMessage(userDB, prompt("What is its content") || ""), currentUserDB);
            }}>Send Message</button>
        </>);
}
