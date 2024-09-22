
"use server";
import React from 'react'
import { createSessionClient, createAdminClient } from '../server/appwrite';
import { ID } from 'node-appwrite';
import { cookies } from 'next/headers';
import { parseStringify } from '../utils';



export const signIn = async ({email, password}: signInProps ) => {

    try {
        //Mutation //database /Make fetch
        //fetch for user information.
        const {account} = await createAdminClient();
        const response = await account.createEmailPasswordSession(email, password);
        //if response is successful
        return parseStringify(response);
    }

    catch (error) {
        console.error("error", error)
    }



}

export const signUp = async (userData: SignUpParams) => {

    //destructure data from userData  
    const { email, password, firstName, lastName } = userData;
  let newUserAccount;
    try {
        //Mutation /Database /Make fetch
        const { account } = await createAdminClient();

         newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);

        if(!newUserAccount) throw new Error('Error creating user')

        const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });


        //in nextjs you cannot pass large objects such as userObject through server actions rather you have to stringify it fist
        //this is coming from utils
        return parseStringify(newUserAccount)

    }

    catch (error) {
        console.error('Error', error);
    }
}

// ... your initilization functions

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        const user = await account.get();


        return parseStringify(user);

    } catch (error) {
        console.log(error)
        return null;
    }
}

export const logoutAccount = async () => {
    try {
        const {account} = await createSessionClient();
        cookies().delete('appwrite-session');

        await account.deleteSession('current');

        
        
    } catch (error) {
        return null;
    }
}
