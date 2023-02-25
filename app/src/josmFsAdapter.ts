import { Data, DataBase, instanceTypeSym } from "josm"
import { promises as fs } from "fs"
import path from "path"
import { stringify, parse } from "circ-json"


const exists = async (filename: string) => !!(await fs.stat(filename).catch(() => false).then(() => true))

export async function josmFsAdapter<T>(fsPath: string, initValue: T): Promise<T extends object ? DataBase<T> : Data<T>>
export async function josmFsAdapter<DB extends Data<T> | DataBase<T>, T>(fsPath: string, dataOrDb: DB): Promise<T>
export async function josmFsAdapter(fsPath: string, dbOrDataOrInits: Data<unknown> | DataBase<any>): Promise<any> {
  let dataOrDb: Data<unknown> | DataBase<any>
  let ret: any


  const fileExists = exists(fsPath)
  if (fileExists && (await fs.stat(fsPath)).isDirectory()) {
    new Error("josmFsAdapter: fsPath is a directory")
  }

  let initData: any

  let proms: Promise<any>[] = []

  if (dbOrDataOrInits[instanceTypeSym] === undefined) {
    try {
      initData = parse(await fs.readFile(fsPath, "utf8"))
    }
    catch(e) {
      if (fileExists) new Error("josmFsAdapter: fsPath exists, but is not a valid json")
      initData = dbOrDataOrInits
      proms.push(fs.writeFile(fsPath, stringify(initData), "utf8"))
    }

    if (typeof dbOrDataOrInits !== typeof initData) throw new Error(`josmFsAdapter: data on disk (typeof ${typeof initData}) is not the same type as init data (typeof ${typeof dbOrDataOrInits})`)

    ret = dataOrDb = typeof initData === "object" ? new DataBase(initData) : new Data(initData)
  }
  else {
    dataOrDb = dbOrDataOrInits
    let unableToRead = false

    try {
      initData = parse(await fs.readFile(fsPath, "utf8"))
    }
    catch(e) {
      if (fileExists) new Error("josmFsAdapter: fsPath exists, but is not a valid json")
      unableToRead = true
    }
    
    if (!unableToRead) {
      if (typeof initData === "object") if (dataOrDb[instanceTypeSym] !== "DataBase") throw new Error("josmFsAdapter: data on disk is an object, but given is a Data instance")
      if (typeof initData !== "object") if (dataOrDb[instanceTypeSym] !== "Data") throw new Error("josmFsAdapter: data on disk is not an object, but given is a DataBase instance")
    }
    else {
      let writeData: any
      if (dataOrDb[instanceTypeSym] !== "DataBase") writeData = (dataOrDb as DataBase<any>)()
      else writeData = (dataOrDb as Data<any>).get()

      proms.push(fs.writeFile(fsPath, stringify(writeData), "utf8"))
    }

    
    await Promise.all(proms)
    
    ret = initData
  }
  

  // write to disk

  async function writeToDisk(data: any) {
    await fs.writeFile(fsPath, stringify(data), "utf8")
  }

  if (dataOrDb instanceof Data) {
    dataOrDb.get(writeToDisk, false)
  }
  else {
    dataOrDb(writeToDisk, false)
  }

  return ret
}



export default josmFsAdapter
