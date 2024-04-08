"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarExisteCorreoOpcional = exports.validarExisteTelefonoOpcional = exports.validarNoExisteIdJugador = exports.validarIdParam = exports.validarNoExisteTelfJugador = exports.validarNoExisteEmailJugador = exports.validarTelfBody = exports.validarCorreoBody = exports.validarNombreBody = void 0;
const express_validator_1 = require("express-validator");
const jugador_service_1 = require("../services/jugador.service");
exports.validarNombreBody = [
    (0, express_validator_1.body)("nombre")
        .exists({ values: "falsy" })
        .withMessage("Nombre es requerido")
        .isString()
        .withMessage("El nombre debe ser una cadena de caracteres"),
];
exports.validarCorreoBody = [
    (0, express_validator_1.body)("correo")
        .exists({ values: "falsy" })
        .isEmail()
        .withMessage("Proveer un correo válido"),
];
exports.validarTelfBody = [
    (0, express_validator_1.body)("telf").exists({ values: "falsy" }).isString(),
];
exports.validarNoExisteEmailJugador = [
    (0, express_validator_1.body)("correo").custom((correo) => __awaiter(void 0, void 0, void 0, function* () {
        const existe = yield (0, jugador_service_1.existeEmail)(correo);
        if (existe) {
            throw new Error("El correo especificado ya se encuentra registrado");
        }
    })),
];
exports.validarNoExisteTelfJugador = [
    (0, express_validator_1.body)("telf").custom((telf) => __awaiter(void 0, void 0, void 0, function* () {
        const existe = yield (0, jugador_service_1.existeTelf)(telf);
        if (existe) {
            throw new Error("El teléfono especificado ya existe");
        }
    })),
];
exports.validarIdParam = [
    (0, express_validator_1.param)("id")
        .exists()
        .isNumeric()
        .withMessage("Se debe introducir un ID numérico como parámetro"),
];
exports.validarNoExisteIdJugador = [
    (0, express_validator_1.param)("id")
        .toInt()
        .custom((id) => __awaiter(void 0, void 0, void 0, function* () {
        const existe = yield (0, jugador_service_1.existeId)(id);
        if (!existe) {
            throw new Error("El ID especificado no existe");
        }
    })),
];
exports.validarExisteTelefonoOpcional = [
    (0, express_validator_1.body)("telf")
        .optional()
        .custom((nro) => __awaiter(void 0, void 0, void 0, function* () {
        const existe = yield (0, jugador_service_1.existeTelf)(nro);
        if (existe) {
            throw new Error("El número de teléfono especificado ya existe");
        }
    })),
];
exports.validarExisteCorreoOpcional = [
    (0, express_validator_1.body)("correo")
        .optional()
        .isEmail()
        .withMessage("Se debe proveer un correo válido")
        .custom((correo) => __awaiter(void 0, void 0, void 0, function* () {
        const existe = yield (0, jugador_service_1.existeEmail)(correo);
        if (existe) {
            throw new Error("El número de correo especificado ya existe");
        }
    })),
];
