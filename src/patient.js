const client = require('./fhir').client

async function getPatients(amount) {
    try {
        if (amount) {
            var params = { _count: amount }
        }

        const ret = []
        for await (const res of client.get('Patient', params)) {
            ret.push(...res.map(v => ({
                "id": v.resource.id,
                "name": v.resource.name[0].given.join(' '),
                "lastname": v.resource.name[0].family
            })))
        }

        return ret;
    } catch (err) {
        console.error(err)
        return null
    }
}

async function getPatientInfo(pid) {
    try {
        const data = await client.get(`Patient/${pid}/$everything`).next()
        const patient = data.value
            .filter(v => v.resource.resourceType === 'Patient')
            .map(v => v.resource)[0]

        const observation = []
        for await (const data of client.get(`Observation`)) {
            observation.push(...data
                .filter(v => v.resource.subject.reference.includes(pid))
                .map(v => v.resource)
            )
        }

        const medicationRequest = []
        for await (const data of client.get(`MedicationRequest`)) {
            medicationRequest.push(...data
                .filter(v => v.resource.subject.reference.includes(pid))
                .map(v => v.resource)
            )
        }

        return { patient, observation, medicationRequest }
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.getPatients = getPatients
exports.getPatientInfo = getPatientInfo
