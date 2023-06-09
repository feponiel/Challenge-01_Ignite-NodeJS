import axios from 'axios'
import { parse } from 'csv-parse'
import fs from 'fs'

(async () => {
  const csvPath = new URL('../tmp/temp.csv', import.meta.url)
  const file = fs.createReadStream(csvPath)
    .pipe(parse({
      delimiter: ',',
      skipEmptyLines: true,
      fromLine: 2
    }))

  for await (const chunk of file) {
    axios.post('http://localhost:3333/tasks', {
      title: String(chunk[0]),
      description: String(chunk[1])
    })

    await new Promise(resolve => setTimeout(resolve, 500))
  }

  fs.rm(csvPath, () => {
    console.log('\nOperação concluída. Arquivo excluído da tmp.\n')
  })
})()
