import { body, param } from "express-validator";
import { existeEmail, existeId, existeTelf } from "../services/jugador.service";

export const validarNombreBody = [
  body("nombre")
    .exists({ values: "falsy" })
    .withMessage("Nombre es requerido")
    .isString()
    .withMessage("El nombre debe ser una cadena de caracteres"),
];

export const validarCorreoBody = [
  body("correo")
    .exists({ values: "falsy" })
    .isEmail()
    .withMessage("Proveer un correo válido"),
];

export const validarTelfBody = [
  body("telf").exists({ values: "falsy" }).isString(),
];

export const validarNoExisteEmailJugador = [
  body("correo").custom(async (correo) => {
    const existe = await existeEmail(correo);
    if (existe) {
      throw new Error("El correo especificado ya se encuentra registrado");
    }
  }),
];

export const validarNoExisteTelfJugador = [
  body("telf").custom(async (telf) => {
    const existe = await existeTelf(telf);
    if (existe) {
      throw new Error("El teléfono especificado ya existe");
    }
  }),
];

export const validarIdParam = [
  param("id")
    .exists()
    .isNumeric()
    .withMessage("Se debe introducir un ID numérico como parámetro"),
];

export const validarNoExisteIdJugador = [
  param("id")
    .toInt()
    .custom(async (id) => {
      const existe = await existeId(id);
      if (!existe) {
        throw new Error("El ID especificado no existe");
      }
    }),
];

export const validarExisteTelefonoOpcional = [
  body("telf")
    .optional()
    .custom(async (nro) => {
      const existe = await existeTelf(nro);
      if (existe) {
        throw new Error("El número de teléfono especificado ya existe");
      }
    }),
];

export const validarExisteCorreoOpcional = [
  body("correo")
    .optional()
    .isEmail()
    .withMessage("Se debe proveer un correo válido")
    .custom(async (correo) => {
      const existe = await existeEmail(correo);
      if (existe) {
        throw new Error("El número de correo especificado ya existe");
      }
    }),
];
