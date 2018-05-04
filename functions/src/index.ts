import * as functions from 'firebase-functions'
import FirebaseUtil from './utils/firebase'
import MapUtil from './utils/map'

export const createGeoHash = functions.firestore.document('museum/{museumId}')
  .onCreate(async event => {
    console.log('createGeoHash started')
    const doc = event.data() as Museum
    if (!doc) return null

    const address = doc.address
    console.log(`address: ${address}`)
    const { lat, lng } = await MapUtil.getLocation(address)
    const latitude = lat as any
    const longitude = lng as any
    console.log(`location: ${latitude}, ${longitude}`)
    const geohash = MapUtil.encodeGeohash(latitude as number, longitude as number)
    console.log(`geohash: ${geohash}`)

    return event.ref.set({
      latitude,
      longitude,
      geohash
    }, { merge: true })
  })

  export const createGeoHashBatch = functions.https.onRequest(async (req, res) => {
    try {
      const db = FirebaseUtil.shared
      const snapshot = await db.collection('museum').get()
      snapshot.forEach(async doc => {
        const data = doc.data() as Museum
        console.log(data.id)
        if (!data.geohash) {
          const address = data.address
          const { lat, lng } = await MapUtil.getLocation(address)
          const latitude = lat as any
          const longitude = lng as any
          const geohash = MapUtil.encodeGeohash(latitude as number, longitude as number)
          console.log(`geohash: ${geohash}`)

          return doc.ref.set({
            latitude,
            longitude,
            geohash
          }, { merge: true })
        }
      })
      res.send('success');
    } catch (e) {
      console.log(e)
    }
  })
