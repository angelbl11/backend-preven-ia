const formatoOutput = {
    analisis_clinico: {
      datos_personales: {
        nombre: "",
        edad: "",
        sexo: "",
        id_paciente: ""
      },
      parametros_clinicos: {
        diabetes: {
          glucosa_en_ayunas: "",
          hemoglobina_glucosilada: "",
          insulina_en_ayunas: ""
        },
        hipertension: {
          presion_sistolica: "",
          presion_diastolica: "",
          frecuencia_cardiaca: ""
        },
        obesidad: {
          peso: "",
          altura: "",
          imc: "",
          perimetro_abdominal: "",
          porcentaje_grasa_corporal: ""
        },
        perfil_lipidico: {
          colesterol_total: "",
          hdl: "",
          ldl: "",
          trigliceridos: ""
        },
        otros_parametros: {
          acido_urico: "",
          creatinina: "",
          urea: "",
          gpt_alt: "",
          got_ast: ""
        }
      },
      diagnostico_final: {
        diabetes: "",
        hipertension: "",
        obesidad: "",
        comentarios_adicionales: ""
      }
    }
  };
  
  module.exports = formatoOutput;
  