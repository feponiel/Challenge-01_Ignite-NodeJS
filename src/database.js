import fs from 'fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(info => {
        return Object.entries(search).some(([key, value]) => {
          if (key === 'id') {
            return info[key] === value
          } else {
            return info[key].toLowerCase().includes(value.toLowerCase())
          }
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(info => {
      return info.id === id
    })

    if (rowIndex > (-1)) {
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        ...data,
      }
      this.#persist()
    }
  }

  delete(table, id) {
    const data = this.#database[table]

    const rowIndex = data.findIndex(info => {
      return info.id === id
    })

    if (rowIndex > (-1)) {
      data.splice(rowIndex, 1)
      this.#persist()
    }
  }
}
