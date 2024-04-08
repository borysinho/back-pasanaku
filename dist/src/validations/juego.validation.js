"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarExisteMoneda = exports.validarExisteMontoTotal = exports.validarExisteFecha_InicioOpcional = exports.validarExisteNombreOpcional = exports.validarMontoTotalBody = exports.validarNombreBody = exports.validarFecha_InicioBody = void 0;
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
exports.validarFecha_InicioBody = [
    (0, express_validator_1.body)("fecha_inicio")
        .exists({ values: "falsy" })
        .withMessage("fecha_inicio es requerido")
        .not()
        .isDate({ format: "YYYY-MM-DD" })
        .withMessage("Formato de fecha incorrecto YYYY-MM-DD"),
];
exports.validarNombreBody = [
    (0, express_validator_1.body)("nombre")
        .exists({ values: "falsy" })
        .withMessage(`LLave "nombre" faltante en el body de la request. Se esperaba nombre: "valor"`)
        .isString()
        .withMessage("El nombre del juego debe ser una cadena de caracteres"),
];
exports.validarMontoTotalBody = [
    (0, express_validator_1.body)("monto_total")
        .exists({ values: "falsy" })
        .withMessage(`Llave "monto_total faltante en el body de la request. Se esperaba monto_total: "valor"`)
        .isInt()
        .withMessage(`El valor de la llave "monto_total" debe ser Entero`),
];
exports.validarExisteNombreOpcional = [
    (0, express_validator_1.body)("nombre")
        .optional()
        .isString()
        .withMessage(`El valor de la llave "nombre" debe ser String`),
];
exports.validarExisteFecha_InicioOpcional = [
    (0, express_validator_1.body)("fecha_inicio")
        .optional()
        .not()
        .isDate()
        .withMessage(`Formato de fecha incorrecto YYYY-MM-DD`),
];
exports.validarExisteMontoTotal = [
    (0, express_validator_1.body)("monto_total")
        .optional()
        .isNumeric()
        .withMessage(`El valor de la llave "monto_total" debe ser Int`),
];
exports.validarExisteMoneda = [
    (0, express_validator_1.body)("moneda")
        .optional()
        .isString()
        .withMessage(`El valor de la llave "moneda" debe ser String`)
        .custom((valor) => {
        return valor in client_1.Moneda;
    })
        .withMessage(`El valor de la llave "moneda" es incorrecto`),
];
