'use client'

import { useState } from "react";

const accountVarName = "SubsUniv_Account";
const jsonServerURL = "https://localhost:3001"

export function useConnection() {
    const [sessionData, setSessionData] = useState(sessionStorage!=undefined?JSON.parse(sessionStorage.getItem(accountVarName)):null);

    const setData = (data) => {
        setSessionData(data);
        sessionStorage.setItem(accountVarName, JSON.stringify(data));
    };

    return [sessionData, setData];
    // {account: {username: ..., password: ...}}
}

export function useObjectServer() {
    
    return [jsonServerURL, setData];
}
