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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarInvitado = exports.actualizarInvitado = exports.obtenerInvitadosDeJuego = exports.obtenerInvitados = exports.obtenerInvitado = exports.crearInvitado = void 0;
const prisma_service_1 = __importDefault(require("./prisma.service"));
const crearInvitado = (id_juego_1, _a, nombre_1) => __awaiter(void 0, [id_juego_1, _a, nombre_1], void 0, function* (id_juego, { correo, telf }, nombre) {
    try {
        const invitado = yield prisma_service_1.default.invitados.create({
            data: {
                correo,
                telf,
                invitados_juegos: {
                    create: [
                        {
                            id_juego,
                            nombre_invitado: nombre,
                        },
                    ],
                },
            },
        });
        return invitado;
    }
    catch (error) {
        throw new Error(`Error en invitado.service.crearInvitado. Message: ${error.message}`);
    }
});
exports.crearInvitado = crearInvitado;
const obtenerInvitado = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const invitado = yield prisma_service_1.default.invitados.findUnique({
        where: {
            id,
        },
    });
    return invitado;
});
exports.obtenerInvitado = obtenerInvitado;
const obtenerInvitados = () => __awaiter(void 0, void 0, void 0, function* () {
    const invitados = yield prisma_service_1.default.invitados.findMany();
    return invitados;
});
exports.obtenerInvitados = obtenerInvitados;
const obtenerInvitadosDeJuego = (id_juego) => __awaiter(void 0, void 0, void 0, function* () {
    const invitados = yield prisma_service_1.default.invitados.findMany({
        where: {
            invitados_juegos: {
                some: {
                    id_juego,
                },
            },
        },
    });
    return invitados;
});
exports.obtenerInvitadosDeJuego = obtenerInvitadosDeJuego;
const actualizarInvitado = (id_1, _b) => __awaiter(void 0, [id_1, _b], void 0, function* (id, { correo, telf }) {
    const invitado = yield prisma_service_1.default.invitados.update({
        where: {
            id,
        },
        data: {
            correo,
            telf,
        },
    });
    return invitado;
});
exports.actualizarInvitado = actualizarInvitado;
const eliminarInvitado = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const invitado = yield prisma_service_1.default.invitados.delete({
        where: {
            id,
        },
    });
});
exports.eliminarInvitado = eliminarInvitado;
