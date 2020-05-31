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
        const patient = await client.get(`Patient/${pid}/$everything`)

        data = await client.get(`Observation`)
        let observation = data.filter(v => v.resource.subject.reference.includes(pid))

        data = await client.get(`MedicationRequest`)
        const medicationRequest = data.filter(v => v.resource.subject.reference.includes(pid))

        return {patient, observation, medicationRequest}
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.getPatients = getPatients
exports.getPatientInfo = getPatientInfo
