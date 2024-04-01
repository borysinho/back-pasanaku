import { body, param } from "express-validator";
import { existeId } from "../services/jugador.service";
import { Moneda } from "@prisma/client";

export const validarFecha_InicioBody = [
  body("fecha_inicio")
    .exists({ values: "falsy" })
    .withMessage("fecha_inicio es requerido")
    .not()
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Formato de fecha incorrecto YYYY-MM-DD"),
];

export const validarNombreBody = [
  body("nombre")
    .exists({ values: "falsy" })
    .withMessage(
      `LLave "nombre" faltante en el body de la request. Se esperaba nombre: "valor"`
    )
    .isString()
    .withMessage("El nombre del juego debe ser una cadena de caracteres"),
];

export const validarMontoTotalBody = [
  body("monto_total")
    .exists({ values: "falsy" })
    .withMessage(
      `Llave "monto_total faltante en el body de la request. Se esperaba monto_total: "valor"`
    )
    .isInt()
    .withMessage(`El valor de la llave "monto_total" debe ser Entero`),
];

export const validarExisteNombreOpcional = [
  body("nombre")
    .optional()
    .isString()
    .withMessage(`El valor de la llave "nombre" debe ser String`),
];

export const validarExisteFecha_InicioOpcional = [
  body("fecha_inicio")
    .optional()
    .not()
    .isDate()
    .withMessage(`Formato de fecha incorrecto YYYY-MM-DD`),
];

export const validarExisteMontoTotal = [
  body("monto_total")
    .optional()
    .isNumeric()
    .withMessage(`El valor de la llave "monto_total" debe ser Int`),
];

export const validarExisteMoneda = [
  body("moneda")
    .optional()
    .isString()
    .withMessage(`El valor de la llave "moneda" debe ser String`)
    .custom((valor) => {
      return valor! in Moneda;
    })
    .withMessage(`El valor de la llave "moneda" es incorrecto`),
];
