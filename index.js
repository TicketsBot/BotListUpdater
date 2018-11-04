// Imports
const fs = require('fs')
const toml = require('toml')
const axios = require('axios')

// Config
const config = toml.parse(fs.readFileSync('config.toml'))
const counterBase = config.serverCounter.baseUrl

// Utils
function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}

// Delegate bot list updates
function updateDbotsOrg(count) {
  var baseUrl = config.botlists.dbotsorg.baseUrl
  var apiKey = config.botlists.dbotsorg.apiKey
  var id = config.botlists.dbotsorg.id

  var data = {
    server_count: count
  }

  var headers = {
    Authorization: apiKey
  }

  axios.post(`${baseUrl}/bots/${id}/stats`, data, { headers: headers })
    .then((res) => {
      console.log(res)
    }).then((err) => {
      console.log(err)
    })
}

// Core
async function run() {
  while(true) {
    await sleep(config.serverCounter.cooldown * 1000)
    axios.get(`${counterBase}/total`)
      .then((res) => {
        var data = res.data
        if(!data.success) {
          console.log(`An error occurred in the data set ${data}`)
          return
        }

        var count = data.count

        updateDbotsOrg(count)
      })
      .catch((err) => {
        console.log(`An error occurred. Status code: ${err.response.status}. Data: ${JSON.stringify(err.response.data)}`)
      })
      .then(() => {})
  }
}

run()
