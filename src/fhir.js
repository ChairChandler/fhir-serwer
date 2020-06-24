const needle = require('needle')
const clInfo = require('./client.json')

class Fhir {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    async* get(path, query) {

        let params = ['_format=json']
        if (query) {
            params.push(...(query.map(k => `${k}=${query[k]}`)))
        }
        params = '?' + params.join('&')
        let url = `${this.baseUrl}${path[0] !== '/' ? '/' : ''}${path}${params}`

        while(true) {
            let json = JSON.parse((await needle('get', url)).body.toString())
            yield json.entry
            const link = json.link.find(v => v.relation === 'next')
            if(link) {
                url = link.url
            } else {
                break
            }

        }
    }
}

exports.client = new Fhir(clInfo.addr)
