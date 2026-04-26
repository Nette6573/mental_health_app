import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('Please add your MongoDB URI to .env.local')
  }

  const options = {}

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    return global._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    return client.connect()
  }
}

export default getClientPromise()