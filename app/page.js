'use client'

import { useEffect, useState } from "react";

import Link from "next/link";

import { useConnection } from "@/src/connection/connections";

import styles from "@/app/page.module.css";
import "@/app/globals.css";

function LoggedHome({connectionHook}) {
  return (<div>
      <h1>Logged</h1>
    </div>);
}

function UnloggedHome({connectionHook}) {
  return (<main className={styles.main}>
      <h1 className={styles.title}>Welcome to the Subscribe Universe.</h1>
      <p><Link href="/login" className={styles.link}>Login</Link> or <Link href="/register" className={styles.link}>Register</Link> to start.</p>
      
    </main>);
}

export default function Home() {
  const [sessionData, setSessionData] = useConnection();
  const [tag, setTag] = useState(<UnloggedHome />);
  
  useEffect(() => {
    if (sessionData != null?(sessionData.account != null):false)
      setTag(<LoggedHome connectionHook={{sessionData, setSessionData}} />);

    else
      setTag(<UnloggedHome connectionHook={{sessionData, setSessionData}} />);

  }, [sessionData]);

  return tag;

}