import { Data, DataBase, instanceTypeSym } from "josm"
import { mkdir, promises as fs } from "fs"
import path from "path"
import { stringify, parse } from "circ-json"
import mkdirp from "mkdirp"


const exists = (filename: string) => fs.stat(filename).then(() => true).catch(() => false)

export async function josmFsAdapter<DB extends Data<T> | DataBase<T>, T>(fsPath: string, dataOrDb: DB): Promise<DB extends Data<infer R> ? R : DB extends DataBase<infer R> ? R : never>
export async function josmFsAdapter<T>(fsPath: string, initValue: T): Promise<T extends object ? DataBase<T> : Data<T>>
export async function josmFsAdapter(fsPath: string, dbOrDataOrInits: Data<unknown> | DataBase<any>): Promise<any> {
  let dataOrDb: Data<unknown> | DataBase<any>
  let ret: any

  const waitTillPath = mkdirp(path.dirname(fsPath))

  const fileExists = await exists(fsPath)
  if (fileExists && (await fs.stat(fsPath)).isDirectory()) {
    new Error("josmFsAdapter: fsPath is a directory")
  }

  let initData: any

  let proms: Promise<any>[] = []

  if (dbOrDataOrInits[instanceTypeSym] === undefined) {
    let rawData: string
    try {
      initData = parse(rawData = await fs.readFile(fsPath, "utf8"))
    }
    catch(e) {
      if (fileExists) if (rawData !== "") new Error("josmFsAdapter: fsPath exists, but is not a valid json")
      initData = dbOrDataOrInits
      await waitTillPath
      proms.push(writeToDisk(initData))
    }

    if (typeof dbOrDataOrInits !== typeof initData) throw new Error(`josmFsAdapter: data on disk (typeof ${typeof initData}) is not the same type as init data (typeof ${typeof dbOrDataOrInits})`)

    ret = dataOrDb = typeof initData === "object" ? new DataBase(initData) : new Data(initData)
  }
  else {
    dataOrDb = dbOrDataOrInits
    let unableToRead = false

    let rawData: string
    try {
      initData = parse(rawData = await fs.readFile(fsPath, "utf8"))
    }
    catch(e) {
      unableToRead = true
      if (fileExists) if (rawData !== "") new Error("josmFsAdapter: fsPath exists, but is not a valid json")
    }
    
    if (!unableToRead) {
      if (typeof initData === "object") if (dataOrDb[instanceTypeSym] !== "DataBase") throw new Error("josmFsAdapter: data on disk is an object, but given is a Data instance")
      if (typeof initData !== "object") if (dataOrDb[instanceTypeSym] !== "Data") throw new Error("josmFsAdapter: data on disk is not an object, but given is a DataBase instance")
    }
    else {
      let writeData: any
      if (dataOrDb[instanceTypeSym] === "DataBase") writeData = (dataOrDb as DataBase<any>)()
      else writeData = (dataOrDb as Data<any>).get()

      await waitTillPath
      proms.push(writeToDisk(writeData))
    }

    ret = initData
  }
  

  // write to disk

  async function writeToDisk(data: any) {
    if (data === undefined) await fs.writeFile(fsPath, "", "utf8")
    else await fs.writeFile(fsPath, stringify(data), "utf8")
  }

  
  await waitTillPath

  if (dataOrDb instanceof Data) {
    dataOrDb.get(writeToDisk, false)
  }
  else {
    dataOrDb(writeToDisk, false)
  }

  await Promise.all(proms)

  return ret
}



export default josmFsAdapter
