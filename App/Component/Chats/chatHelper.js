import React, { Component } from 'react';
import {chatCreds} from '../../Component/_services';
import QB from 'quickblox-react-native-sdk';

export const initiateChat = () =>{
  QB.settings
  .init(chatCreds)
  .then(function () {
    console.log('chat initiate successfully')
    // SDK initialized successfully
  })
  .catch(function (e) {
    console.log('chat cannot initiate',e)
    // Some error occured, look at the exception message for more details
  });
}

export const isConnection = async () =>{
  try {
    const connected = await QB.chat
      .isConnected();
    console.log('connections', connected);
    return connected;
  }
  catch (e) { console.log('Error with isUSerconnection',e) }
}

export const checkSessions = async() =>{

  try {
    const session = await QB.auth.getSession();
    return session
  } catch (error) {
    console.log(error);
    return error
  }
 
}

export const createUserSession = async(LName,UPwd)=>{
 
    try {
      const info = await QB.auth
      .login({
        login: LName,
        password: UPwd
      });
      return info;
    } catch (error) {
      console.log(error);
    }
  
}

export const createConnectionToServer = async(userid,userpwd) => {

  try {
      const conn = await  QB.chat
      .connect({
          userId: userid,
          password: userpwd
      })
      console.log('connect successfully')
      return true;
  } catch (error) {
    console.log(error)
  }
  
}


