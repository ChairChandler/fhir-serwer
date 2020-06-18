const client = require('./fhir').client

async function getPatients(amount) {
    try {
        if (amount) {
            var params = { _count: amount }
        }

        const res = await client.get('Patient', params)
        const ret = res.map(v => ({
            "id": v.resource.id,
            "name": v.resource.name[0].given.join(' '),
            "lastname": v.resource.name[0].family
        }))
        return ret;
    } catch (err) {
        console.error(err)
        return null
    }
}

async function getPatientInfo(pid) {
    try {
        let data = await client.get(`Patient/${pid}/$everything`)
        const patient = data.filter(v => v.resource.resourceType === 'Patient').map(v => v.resource)[0]

        data = await client.get(`Observation`)
        let observation = data.filter(v => v.resource.subject.reference.includes(pid)).map(v => v.resource)

        data = await client.get(`MedicationRequest`)
        const medicationRequest = data.filter(v => v.resource.subject.reference.includes(pid)).map(v => v.resource)

        return { patient, observation, medicationRequest }
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.getPatients = getPatients
exports.getPatientInfo = getPatientInfo
