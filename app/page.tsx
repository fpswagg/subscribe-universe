'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

import { userType, sessionDataType, useConnection, useObjectServer } from "@/src/connection/connections";
import "@/app/globals.css";
import styles from "@/app/page.module.css";

function LoggedHome({connectionHook}) {
  const user = connectionHook.sessionData.user;
  return (<main className={styles.main}>
      <h1 className={styles.title}>Welcome back to the Subscribe Universe.</h1>
      <p><Link href={`/${user.username}`} className={styles.link}>Press here to go back to your account.</Link></p>
    
    </main>);
}

function UnloggedHome({connectionHook}) {
  return (<main className={styles.main}>
      <h1 className={styles.title}>Welcome to the Subscribe Universe.</h1>
      <p><Link href="/login" className={styles.link}>Login</Link> or <Link href="/register" className={styles.link}>Register</Link> to start.</p>
      
    </main>);
}

export default function Home() {
  const [url, getUsers, checkAccount] = useObjectServer();
  const [sessionData, setSessionData] = useConnection(sessionStorage);
  const [tag, setTag]: [JSX.Element, Function] = useState(<UnloggedHome connectionHook={{sessionData, setSessionData}} />);
  
  useEffect(() => {
    getUsers().then(users => {
      let flag = false;

      if (sessionData != null?(sessionData.user != null):false) {
        console.dir(sessionData.user)
        console.dir(users)

        const status = checkAccount(sessionData.user, users);

        if (status == null) {
          setTag(<LoggedHome connectionHook={{sessionData, setSessionData}} />);

          flag = true;

        } else
          alert(`It's like your ${status} changed.`)

      }

      if (!flag)
        setTag(<UnloggedHome connectionHook={{sessionData, setSessionData}} />);
    }).catch(error => alert("Could not access the database."));

  }, [sessionData]);

  return tag;

}