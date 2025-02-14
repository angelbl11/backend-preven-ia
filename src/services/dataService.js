const axios = require('axios');

async function getObesityRisk(result) {
    const { imc, ldl, trigliceridos, glucosa_ayunas, insulina, condicion_genetica } = result;

    try {
        const response = await axios.post('https://ml-preven-ia.onrender.com/predict/obesity', {
            imc,
            ldl,
            trigliceridos,
            glucosa_ayunas,
            insulina,
            condicion_genetica
        });

        const obesityRisk = response.data;
        return obesityRisk;
    } catch (error) {
        console.error('Error fetching obesity risk:', error);
        throw error;
    }
}

async function getDiabetesRisk(result) {
    const { glucosa_ayunas, insulina, hba1c, condicion_genetica } = result;

    try {
        const response = await axios.post('https://ml-preven-ia.onrender.com/predict/diabetes', {
            glucosa_ayunas,
            insulina,
            hba1c,
            condicion_genetica
        });

        const diabetesRisk = response.data;
        return diabetesRisk;
    } catch (error) {
        console.error('Error fetching diabetes risk:', error);
        throw error;
    }
}

async function getHypertensionRisk(result) {
    const { presion_arterial_sistolica, presion_arterial_diastolica, creatinina, ldl, condicion_genetica, edad } = result;

    try {
        const response = await axios.post('https://ml-preven-ia.onrender.com/predict/hipertension', {
            presion_arterial_sistolica,
            presion_arterial_diastolica,
            creatinina,
            ldl,
            condicion_genetica,
            edad
        });

        const hypertensionRisk = response.data;
        return hypertensionRisk;
    } catch (error) {
        console.error('Error fetching hypertension risk:', error);
        throw error;
    }
}

module.exports = {
    getObesityRisk,
    getDiabetesRisk,
    getHypertensionRisk
};