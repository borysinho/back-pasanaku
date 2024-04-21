export const calcularFinDeOfertas = (
  fecha_inicio_pujas: Date,
  tiempo_segundos: number
) => {
  const fecha_fin_pujas: Date = new Date(fecha_inicio_pujas);
  fecha_fin_pujas.setTime(fecha_fin_pujas.getTime() + tiempo_segundos * 1000);
  return fecha_fin_pujas;
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
