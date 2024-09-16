import { Collection, createLocalStorageAdapter, SyncManager } from "signaldb"
import vueReactivityAdapter from "signaldb-plugin-vue"

export type User = { id: string; name: string }
const name = "users"
const remoteData = new Map<string, User>()

const sync = new SyncManager({
  pull: async () => {
    return { items: Array.from(remoteData.values()) }
  },
  push: async (_config, data) => {
    data.changes.added.forEach((item) => remoteData.set(item.id, item))
    data.changes.modified.forEach((item) => remoteData.set(item.id, item))
    data.changes.removed.forEach((item) => remoteData.delete(item.id))
  },
})

class Store {
  private collection

  constructor() {
    this.collection = new Collection<User, string, User>({
      reactivity: vueReactivityAdapter,
      persistence: createLocalStorageAdapter(name),
    })
    sync.addCollection(this.collection, { name })
  }

  public listUsers = () => this.collection.find().fetch()

  public getUser = () => this.collection.find().fetch()

  public addUser = (name: string) => this.collection.insert({ name })

  public updateUser = (id: string, name: string) => this.collection.updateOne({ id }, { $set: { name } })

  public removeUser = (id: string) => this.collection.removeOne({ id })
}

export default new Store()
