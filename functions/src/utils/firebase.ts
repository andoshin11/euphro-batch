import * as functions from 'firebase-functions'
import * as firebase from 'firebase'
import 'firebase/firestore'

const config = {
  apiKey: functions.config().firestore.api_key,
  authDomain: functions.config().firestore.auth_domain,
  databaseURL: functions.config().firestore.database_url,
  projectId: functions.config().firestore.project_id,
  storageBucket: functions.config().firestore.storage_bucket,
  messagingSenderId: functions.config().firestore.messaging_sender_id
}

const getClient = (): firebase.firestore.Firestore => {
  firebase.initializeApp(config)
  const db = firebase.firestore()
  db.settings({timestampsInSnapshots: true})
  return db
}

export default class FirebaseUtil {
  static shared = getClient()
}
