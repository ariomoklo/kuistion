import { initializeApp } from "firebase/app"

export const firebaseConfig = {
  apiKey: "AIzaSyAZ05SsfWhHwkbhaaL6HtwTYjlSLP5xsn4",
  authDomain: "kuistion.firebaseapp.com",
  databaseURL: "https://kuistion-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kuistion",
  storageBucket: "kuistion.appspot.com",
  messagingSenderId: "616354230698",
  appId: "1:616354230698:web:9cb1d29787cc54a9277bd3",
  measurementId: "G-22LDGY68P0"
}

export function initFirebaseClient() {
  return initializeApp(firebaseConfig)
}