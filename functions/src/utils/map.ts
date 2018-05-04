import * as functions from 'firebase-functions'
import { createClient } from '@google/maps'
import {} from '@types/googlemaps'

export default class MapUtil {
  static async getLocation(address: string): Promise<google.maps.LatLng> {
    const client = createClient({ key: functions.config().geocoding.api_key || '', Promise: Promise })
    const res = await client.geocode({ address }).asPromise()
    const { location } = res.json.results[0].geometry
    return location
  }
}
