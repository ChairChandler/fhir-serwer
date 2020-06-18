const needle = require('needle')
const clInfo = require('./client.json')

class Fhir {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    async get(path, query) {
    
        let params = ['_format=json']
        if(query) {
            params.push(...(query.map(k => `${k}=${query[k]}`)))
        }
        params = '?' + params.join('&')
        const url = `${this.baseUrl}${path[0] !== '/' ? '/' : ''}${path}${params}`
        return JSON.parse((await needle('get', url)).body.toString()).entry
    }
}

exports.client = new Fhir(clInfo.addr)
