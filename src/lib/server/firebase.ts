import { project_id, client_email, private_key } from 'firebase-service-account-key'
import { FIREBASE_REALTIME_DBURL } from '$env/static/private'
import admin from 'firebase-admin'

export function setup () {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({ 
        projectId: project_id,
        clientEmail: client_email,
        privateKey: private_key
      }),
      databaseURL: FIREBASE_REALTIME_DBURL
    })
  } catch (error) {
    // console.error(error)
  }
}
