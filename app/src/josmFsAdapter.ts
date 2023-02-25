import { Data, DataBase, instanceTypeSym } from "josm"
import fss, { promises as fs } from "fs"
import path from "path"
import { stringify, parse } from "circ-json"




export function josmFsAdapter<T>(fsPath: string, initValue: T): T extends object ? DataBase<T> : Data<T>
export function josmFsAdapter<DB extends Data<T> | DataBase<T>, T>(fsPath: string, dataOrDb: DB): T
export function josmFsAdapter(fsPath: string, dbOrDataOrInits: Data<unknown> | DataBase<any>): any {
  let dataOrDb: Data<unknown> | DataBase<any>
  let ret: any


  if (fss.existsSync(fsPath) && fss.statSync(fsPath).isDirectory()) {
    new Error("josmFsAdapter: fsPath is a directory")
  }

  let initData: any



  if (dbOrDataOrInits[instanceTypeSym] === undefined) {
    try {
      initData = parse(fss.readFileSync(fsPath, "utf8"))
    }
    catch(e) {
      initData = dbOrDataOrInits
      fss.writeFileSync(fsPath, stringify(initData), "utf8")
    }

    if (typeof dbOrDataOrInits !== typeof initData) throw new Error(`josmFsAdapter: data on disk (typeof ${typeof initData}) is not the same type as init data (typeof ${typeof dbOrDataOrInits})`)

    ret = dataOrDb = typeof initData === "object" ? new DataBase(initData) : new Data(initData)
  }
  else {
    dataOrDb = dbOrDataOrInits

    try {
      initData = parse(fss.readFileSync(fsPath, "utf8"))
    }
    catch(e) {
      if (dataOrDb[instanceTypeSym] !== "DataBase") initData = {}
    }

    
    if (typeof initData === "object") if (dataOrDb[instanceTypeSym] !== "DataBase") throw new Error("josmFsAdapter: data on disk is an object, but given is a Data instance")
    if (typeof initData !== "object") if (dataOrDb[instanceTypeSym] !== "Data") throw new Error("josmFsAdapter: data on disk is not an object, but given is a DataBase instance")
    ret = initData
  }
  

  // write to disk

  async function writeToDisk(data: any) {
    await fs.writeFile(fsPath, stringify(data), "utf8")
  }

  if (dataOrDb instanceof Data) {
    dataOrDb.get(writeToDisk)
  }
  else {
    dataOrDb(writeToDisk)
  }

  return ret
}



export default josmFsAdapter
