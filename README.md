# Josm fs adapter

Sync (unidirectional, josm -> file) a json file to your josm Data or DataBase

## Installation

```shell
 $ npm i josm-fs-adapter
```

## Usage

From a default (or init) value. This creates a Data or DataBase instance. Any manipulation of the Data or DataBase will be reflected in file. All subsequent calls will use the value stored in the file as starting point.

```ts
import josmFsAdapter from "josm-fs-adapter"

const data = await josmFsAdapter("myFilePath.json", "initValue")

data.get() // first execution: "initValue"; second execution: "changedValue"

data.set("changedValue") 
```

This works analog for DataBases.

```ts
const dataBase = await josmFsAdapter("myFilePath.json", { key: "initValue" })

dataBase() // first execution: { key: "initValue" }; second execution: { key: "initValue", key2: "changedValue" }

dataBase({ key2: "changedValue" }) 
```

### With a given Data or DataBase

When you have a given Data or DataBase instance, that you want to reflect in a file. Provide it as second argument, instead of the init value. The value stored in file will not be applied to the Data or DataBase instance. Instead it is returned, to give more freedom. You may set it yourself, but you may also ignore it.

```ts
import { Data } from "josm"

const data = new Data("initValue")

const fileValue = await josmFsAdapter("myFilePath.json", data) // first execution: "initValue"; second execution: "changedValue"

data.get() // "initValue" no matter what is stored in file

data.set("changedValue")
```

This works analog for DataBases.

```ts
import { DataBase } from "josm"

const dataBase = new DataBase({ key: "initValue" })

const fileValue = await josmFsAdapter("myFilePath.json", dataBase) // first execution: { key: "initValue" }; second execution: { key: "initValue", key2: "changedValue" }

dataBase() // { key: "initValue" } no matter what is stored in file

dataBase({ key2: "changedValue" })
```


## Contribute

All feedback is appreciated. Create a pull request or write an issue.
