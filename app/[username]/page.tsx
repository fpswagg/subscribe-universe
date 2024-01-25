'use client'

import { useEffect, useState } from "react"

import { useConnection, useObjectServer, userType, userTypeDB } from "@/src/connection/connections";
import CurrentUserPage from "@/src/pages/MainUser";
import OtherUserPage from "@/src/pages/OtherUser";

import styles from "@/app/page.module.css";


export default function UserPage({params}) {
    const [sessionData, setSessionData] = useConnection(window.sessionStorage);

    let sessionUser: userType|null = null;

    if (sessionData != null)
        sessionUser = sessionData.user;

    const useObjectServer_i = useObjectServer();
    const [url, getUsers, checkAccount, getUser, getUsingUser, addUser, removeUser, getMessages, makeMessage, addMessage] = useObjectServer_i;
    const username = params.username;
    const [mainPage, setPage] = useState(null);

    var isMainPage = false;

    useEffect( () => {
        getUsers().then(users => {
            getUser("username", username, users).then(user_arr => {
                if (user_arr != null && sessionUser != null) {
                    getUsingUser(sessionUser).then(([id, currentUser, auth]) => {
                        if (auth?(isMainPage = (currentUser!.username == username)):false)
                            setPage(<CurrentUserPage currentUserDB={currentUser} styles={styles} useObjectServer={useObjectServer_i} usersDB={users} />);
                        else
                            setPage(<OtherUserPage userDB={user_arr[1]} currentUserDB={currentUser} styles={styles} useObjectServer={useObjectServer_i} usersDB={users} />);
                        
                     });
                }
            });
        });
        
    }, []);

    return (<div>
        {mainPage || (<>
            <h1>The page of {username}</h1>
            <p>Loading...</p>
        </>)}
    </div>)
}