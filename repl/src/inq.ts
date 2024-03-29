import inquirer from "inquirer"
import Xrray from "xrray"
Xrray(Array)


type GenericObject = {[key in string]: any}

type basicQuestion = GenericObject[] | GenericObject

type Questions = basicQuestion | ((options: GenericObject) => basicQuestion | Promise<basicQuestion>) | ((options: GenericObject) => basicQuestion | Promise<basicQuestion>)[]

export default async function inq<T = any>(questions: string): Promise<string>
export default async function inq<T = any>(questions: Questions, ignore?: string[] | GenericObject)
export default async function inq<T = any>(questions: ((options: GenericObject) => Questions | Promise<Questions>), options: GenericObject)
export default async function inq<T = any>(questions: string | Questions | ((options: GenericObject) => Questions | Promise<Questions>), options_ignore: GenericObject | string[] = {}) {
  if (typeof questions === "function") {
    //@ts-ignore
    let ans = await questions(options_ignore)
    return await inq(ans, options_ignore)
  }
  else {
    
    let wasSingle = !(questions instanceof Array)
    if (wasSingle) {
      //@ts-ignore
      if (typeof questions === "string") {
        questions = {message: questions}
      }
      //@ts-ignore
      if (questions.name === undefined) questions.name = "autofilledNameSinceThereIsJustOneQuestion"
      questions = [questions]
    }

    let options: GenericObject
    let ignore: string[]

    if (options_ignore instanceof Array) {
      options = {}
      ignore = options_ignore
    }
    else {
      options = options_ignore
      ignore = Object.keys(options_ignore)
    }

    let quests = questions as any[]
    

    await quests.ea(async (e, i) => {
      if (typeof e === "function") {

        let newquestions = await e(options)
        if (newquestions === undefined) return;
        if (!(newquestions instanceof Array)) newquestions = [newquestions]
        i++
        newquestions.ea((q: any) => {
          quests.inject(q, i)
          i++
        })
      }
      else if (!ignore.includes(e.name)) {
        let ans = await inquirer.prompt([e]) as any

        options[e.name] = ans[e.name]
      }
    })

    if (wasSingle) {
      return options[Object.keys(options).first]
    }
    else return options

  }
}