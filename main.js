const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const cors = require('cors')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const sections = [
  {
    header: 'Saving files via api',
    content: 'Use it in order to build a book from crawled pages.\
     Please run with this pattern `npm start -- [--<option> <value>]`'
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'from',
        typeLabel: '{underline number}',
        description: 'Auto-increment index, used in file name.'
      },
      {
        name: 'help',
        description: 'Print this usage guide.'
      }
    ]
  }
]
const usage = commandLineUsage(sections)


const optionDefinition = [
  {
    name: 'from', type: Number, defaultValue: 0
  },
  {
    name: 'help', type: Boolean, defaultValue: false
  }
]

const options = commandLineArgs(optionDefinition)

if (options.help) {
  console.log(usage)
  process.exit(0)
}

const corsOptions = {
  origin: '*'
}

let i = options.from

const basePath = 'img'

app.use(bodyParser.text({
  type: 'text/plain',
  limit: '20mb'
}))

app.use(bodyParser.json())

app.use(cors(corsOptions))

const defaultExtension = 'png'

const getFileName = (id, extension) => {
  extension = extension || defaultExtension
  return [id, extension].join('.')
}

const getNextFilename = (extension) => {
  return getFileName(i++, extension)
}

const extractExtension = (url) => {
  return url.substr(url.lastIndexOf('.') + 1)
}

const onError = (err, filename) => {
  console.error(`Error with file ${filename}`, err)
}

const onSuccess = (filename) => {
  console.log(`File ${filename} written`)
}

const saveToFile = (base64String, filename) => {
  if (!filename) {
    filename = getNextFilename()
  }

  return new Promise((resolve, reject) => {
    const text = base64String.split(';base64,').pop()
    const filePath = path.resolve(basePath, filename)
    fs.writeFile(filePath, text, {encoding: 'base64'}, (err) => {
      if (err) {
        onError(err, filename)
        return reject(err)
      }

      return onSuccess(filename)
    })

    resolve(filename)
  })
}

const downloadFileByLink = (link, saveAs) => {
  return new Promise((resolve, reject) => {
    const extension = extractExtension(link)
    const filename = saveAs || getNextFilename(extension)
    const filePath = path.resolve(basePath, filename)
    childProcess.exec(`wget ${link} -O ${filePath}`, (e) => {
      if (e) {
        onError(e, filename)
        return reject(e)
      }
      onSuccess(filename)
      resolve(filename)
    })
  })
}

app.post('/links', async ( req, res ) => {
  const links = req.body
  if (!links || !Array.isArray(links)) {
    console.error(`No links. Got this body`, req.body)
    return res.status(500).send(`No link. Got this body ${req.body}`)
  }

  try {
    const results = []
    for (const link of links) {
      const filename = await downloadFileByLink(link)
      results.push(`File ${filename} was written`)
    }
    res.send(results.join('\n'))
  } catch (e) {
    res.status(500).send(`Error happened ${e.message}`)
  }
})

app.post('/links/save-as', async (req, res) => {
  const { link, filename } = req.body

  const linksInfo = req.body
  if (!linksInfo || !Array.isArray(linksInfo)) {
    console.error(`No links. Got this body`, req.body)
    return res.status(500).send(`No link. Got this body ${req.body}`)
  }

  const results = []
  for (const linkInfo of linksInfo) {
    const { link, filename } = linkInfo
    if (!link || !filename) {
      console.error(`No link and filename. Got this body`, req.body)
      return res.status(500).send(`No link and filename. Got this body ${req.body}`)
    }

    await downloadFileByLink(link, filename)
    results.push(`File ${filename} was written`)
  }

  res.send(results.join('\n'))
})

app.post('/id/:id', async (req, res) => {
  try {
    const filename = getFileName(req.params.id)
    await saveToFile(req.body, filename)
    res.send(`File ${filename} was written`)
  } catch (e) {
    res.status(500).send(`Error happened ${e.message}`)
  }
})

app.post('/', async (req, res) => {
  try {
    const filename = await saveToFile(req.body)

    res.send(`File ${filename} was written`)
  } catch (e) {
    res.status(500).send(`Error happened ${e.message}`)
  }
})

app.listen(3000, () => {
  console.log('started')
  console.log(`starting from...#${i}`)
})