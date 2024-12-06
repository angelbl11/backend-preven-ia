const formatOutput = {
    clinical_analysis: {
      datos_personales: {
        instruccion: "escribe el nombre de los objetos en ingles pero los contenidos en español",
        name: "",
        age: "",
        sex: "",
      },
      clinical_parameters: {
        instruccion: "No escribas el apartado de instruccion en el formato final. Sigue el siguiente formato para los parametros clinicos, si son varias palabras separalas por un guion bajo, no encierres los parametros entre comillas solo redactalos como un objeto JSON, escribe tantos parametros como haya en el analisis clinico, que cada parametro quede como un objeto respetando el siguiente formato:",
        parametro_1: "",
        parametro_2: "",
        parametro_n: ""
      },
      diagnostico_final: {
        instruccion: "No escribas este apartado en el formato final. Para los siguientes campos, escribe un resumen de los parametros relacionados a la enfermedad y describe una opinion medica haciendo alucion al estado y probabilidad del paciente de tener esta enferemedad, escribe como si estubieras hablando directamente con el paciente",
        diabetes: "",
        hypertension: "",
        obesity: "",
        prognostic: "En esta parte escribe un resumen general y un prognostico general del paciente",
        recomendations: "Escribe recomendaciones sobre cambios en estilo de vida, ademas recuerda recomendar una opinion medica experta en caso de ser necesario"
      }
    }
  };
  
  module.exports = formatOutput;
  