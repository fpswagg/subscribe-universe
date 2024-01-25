'use client'

import { useState } from "react";

const accountVarName = "SubsUniv_Account";
const jsonServerURL = "http://localhost:3001"

export interface messageType {toID: string; content: string; read: boolean; date: number;};
export interface userType {username: string; password: string;};
export interface userTypeDB extends userType {id?: string; pastMessages: messageType[];};
export interface sessionDataType {user: userType;};

export type useConnectionType = [sessionData: sessionDataType, setData: (data: sessionDataType) => void];

export function useConnection(sessionStorage: Storage = window.sessionStorage): useConnectionType {
    const [sessionData, setSessionData] = useState(sessionStorage!=null?JSON.parse(sessionStorage.getItem(accountVarName)!):null) as [sessionData: sessionDataType, setSessionData: any];

    const setData = (data: sessionDataType) => {
        setSessionData(data);
        sessionStorage.setItem(accountVarName, JSON.stringify(data));
    };

    return [sessionData, setData];
    // {account: {username: ..., password: ...}}
}

export type useObjectServerType = [dbURL: string, getUsers: () => Promise<userTypeDB[]>,
checkAccount: (user: userType, users: userTypeDB[]) => string | null,
getUser: (property: string, content: string, users?: userTypeDB[]) => Promise<[number, userTypeDB]|null>,
getUsingUser: (user: userType, users?: userTypeDB[]) => Promise<[number, userTypeDB|null, boolean]>,
addUser: (user: userTypeDB) => Promise<Response>,
removeUser: (id: number) => Promise<Response>,
getMessages: (user: userType, users?: userTypeDB[]) => Promise<[[messageType, userTypeDB][], messageType[]]>,
makeMessage: (toUser: userType, content: string) => messageType,
addMessage: (message: messageType, user: userType) => Promise<Response>];

export function useObjectServer(): useObjectServerType {
    const getUsers = async (): Promise<userTypeDB[]> => {
        let users = await fetch(jsonServerURL+"/users");
        
        return await users.json() as userTypeDB[];
    }

    const checkAccount = (user: userType, users: userTypeDB[]): string|null => {
        var hasUsername = false, hasPassword = false;

        Array.from(users).forEach((user_db: userType) => {
            hasUsername ||= (user_db.username == user.username);
            hasPassword ||= ((user_db.username == user.username) && (user_db.password == user.password));
        });

        if (!hasUsername) {
            return "username";
        }

        if (!hasPassword) {
            return "password";
        }

        return null;

    };

    const getUser = async (property: string, content: string, users?: userTypeDB[]): Promise<[number, userTypeDB]|null> => {
        if (users == undefined)
            users = await getUsers();
    
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            let entries = Object.entries(user);

            for (let [key, value] of entries)
                if (key === property && content === value)
                    return [i, user];
            
        }
    
        
        return null;
    }

    const getUsingUser = async (user: userType, users?: userTypeDB[]): Promise<[number, userTypeDB|null, boolean]> => {
        if (users == undefined)
            users = await getUsers();
    
        let db_user = await getUser("username", user.username, users);

        if (db_user != null)
            return [...db_user, checkAccount(user, users) == null];
        else
            return [-1, null, false];
    }

    const addUser = async (user: userTypeDB): Promise<Response> => await fetch(jsonServerURL+"/users", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {"Content-Type": "application/json"}
    });

    const removeUser = async (id: number): Promise<Response> => await fetch(new URL(jsonServerURL+"/users/"+id), {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    });

    const getMessages = async (user_i: userType, users?: userTypeDB[]): Promise<[[messageType, userTypeDB][], messageType[]]> => {
        if (users == undefined)
            users = await getUsers();
    
        let [id, user, authenticated] = await getUsingUser(user_i, users) as [number, userTypeDB, boolean];
        let receivedMessages: [messageType, userTypeDB][] = [];
        let sentMessages: messageType[] = [...user.pastMessages];

        for (let user_i of users)
            for (let message of user_i.pastMessages)
                if (message.toID === user.id)
                    receivedMessages.push([message, user_i]);

        receivedMessages = receivedMessages.sort((msg1, msg2) => msg1[0].date - msg2[0].date);
        sentMessages = sentMessages.sort((msg1, msg2) => msg1.date - msg2.date);
        
        return [receivedMessages, sentMessages];
    };

    const makeMessage = (toUser: userTypeDB, content: string): messageType => {
        return {
            toID: toUser.id!,
            content: content,
            read: false,
            date: Date.now()
        };
    };

    const addMessage = async (message: messageType, user: userType): Promise<any> => {
        const [id, user_i] = (await getUser("username", user.username))!;
        var objCopy = {...user_i} as userTypeDB;

        objCopy.pastMessages.push(message);

        await removeUser(id);
        await addUser(objCopy);

    };

    return [jsonServerURL, getUsers, checkAccount, getUser, getUsingUser, addUser, removeUser, getMessages, makeMessage, addMessage];
}
