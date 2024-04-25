export const sumarSegundosAFecha = (fecha: Date, tiempo_segundos: number) => {
  const sumaFecha: Date = new Date(fecha);
  sumaFecha.setTime(sumaFecha.getTime() + tiempo_segundos * 1000);
  return sumaFecha;
};

export const tiempoDeOfertas = (fecha: Date, tiempo_segundos: number) => {
  const fecha_fin = sumarSegundosAFecha(fecha, tiempo_segundos);
  const timeStamp = Date.now();
  const fecha_actual = new Date(timeStamp);
  console.log({ fecha_actual, fecha_inicio: fecha });
  return fecha_actual <= fecha_fin;
};

export const formatearTiempo = (segundos: number) => {
  const dias = Math.floor(segundos / (60 * 60 * 24));
  segundos -= dias * (60 * 60 * 24);
  const horas = Math.floor(segundos / (60 * 60));
  segundos -= horas * (60 * 60);
  const minutos = Math.floor(segundos / 60);
  segundos -= minutos * 60;

  return (
    (dias > 0 ? `${dias} días ` : "") +
    (horas > 0 ? `${horas} horas ` : "") +
    (minutos > 0 ? `${minutos} minutos ` : "") +
    (segundos > 0 ? `${segundos} segundos` : "")
  ).trim();
};

export const fechaHoraActual = () => {
  const dateNow = Date.now();
  return new Date(dateNow);
};
