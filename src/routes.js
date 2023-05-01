import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.end(JSON.stringify(tasks))
    },
  },

  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const data = req.body

      const { title, description } = data

      if (title === undefined || description === undefined) {
        return res.writeHead(400).end()
      }

      const newTask = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date(),
        updated_at: new Date(),
        completed_at: null,
      }

      database.insert('tasks', newTask)

      return res.writeHead(201).end(JSON.stringify(newTask))
    },
  },

  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const data = { title, description }

      const task = database.select('tasks', { id })[0]

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({
            message: "No task found with that id"
          }))
      }

      if (title === undefined && description === undefined) {
        return res.writeHead(400).end()
      }

      for (const property in data) {
        if (data[property] === undefined) {
          delete data[property]
        }
      }

      database.update('tasks', id, {
        ...data,
        updated_at: new Date(),
      })

      return res.writeHead(204).end()
    },
  },

  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks', { id })[0]

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({
            message: "No task found with that id"
          }))
      }

      if (task.completed_at) {
        database.update('tasks', id, {
          completed_at: null,
          updated_at: new Date(),
        })
      } else {
        database.update('tasks', id, {
          completed_at: new Date(),
          updated_at: new Date(),
        })
      }

      return res.writeHead(204).end()
    },
  },

  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks', { id })[0]

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({
            message: "No task found with that id"
          }))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    },
  },
]
