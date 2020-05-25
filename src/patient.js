const client = require('./fhir').client

async function getPatients(amount) {
    try {
        if (amount) {
            var params = { _count: amount }
        }

        const res = await client.get('Patient', params)
        return res.map(v => Object({
            "id": v.resource.id,
            "name": v.resource.name[0].given.join(' '),
            "lastname": v.resource.name[0].family
        }))
    } catch (err) {
        console.error(err)
        return null
    }
}

async function getPatientInfo(pid) {
    try {
        const data = await client.get(`Patient/${pid}/$everything`)

        let patient = data.filter(v => v.resource.resourceType === "Patient")[0].resource

        let observation = data.filter(v => v.resource.resourceType === "Observation")
        observation = observation.map(v => { delete v.resource.text; return v.resource })

        const medicationStatement = data.filter(v => v.resource.resourceType === "MedicationStatement")
        const medication = data.filter(v => v.resource.resourceType === "Medication")

        return {
            "patient": patient,
            "observation": observation,
            "medicationStatement": medicationStatement,
            "medication": medication
        }
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.getPatients = getPatients
exports.getPatientInfo = getPatientInfo