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
exports.existeTelf = exports.existeId = exports.existeEmail = exports.eliminarJugador = exports.actualizarJugador = exports.obtenerJugadores = exports.obtenerJugador = exports.crearJugadorAPartirDeInvitacion = exports.crearJugadorSinSerInvitado = void 0;
const prisma_service_1 = __importDefault(require("./prisma.service"));
// const prisma = new PrismaClient();
// export const crearJugadorSinRelacionarAInvitado = async (
const crearJugadorSinSerInvitado = (_a, _b) => __awaiter(void 0, [_a, _b], void 0, function* ({ nombre, usuario, contrasena }, { telf, correo }) {
    const jugador = yield prisma_service_1.default.jugadores.create({
        data: {
            nombre,
            usuario,
            contrasena,
            invitado: {
                create: {
                    correo,
                    telf,
                },
            },
        },
    });
    return jugador;
});
exports.crearJugadorSinSerInvitado = crearJugadorSinSerInvitado;
// export const crearJugadorRelacionandoAInvitado = async (
const crearJugadorAPartirDeInvitacion = (_c, _d) => __awaiter(void 0, [_c, _d], void 0, function* ({ nombre, usuario, contrasena }, { telf, correo }) {
    const jugador = yield prisma_service_1.default.jugadores.create({
        data: {
            nombre,
            usuario,
            contrasena,
            invitado: {
                connect: {
                    correo,
                    telf,
                },
            },
        },
    });
    return jugador;
});
exports.crearJugadorAPartirDeInvitacion = crearJugadorAPartirDeInvitacion;
const obtenerJugador = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const jugador = yield prisma_service_1.default.jugadores.findUnique({
        where: { id },
    });
    return jugador;
});
exports.obtenerJugador = obtenerJugador;
const obtenerJugadores = () => __awaiter(void 0, void 0, void 0, function* () {
    const jugadores = yield prisma_service_1.default.jugadores.findMany();
    return jugadores;
});
exports.obtenerJugadores = obtenerJugadores;
const actualizarJugador = (_e, _f, id_1) => __awaiter(void 0, [_e, _f, id_1], void 0, function* ({ nombre, contrasena }, { correo, telf }, id) {
    const jugador = yield prisma_service_1.default.jugadores.update({
        where: {
            id,
        },
        data: {
            nombre,
            contrasena,
            invitado: {
                update: {
                    correo,
                    telf,
                },
            },
        },
    });
    return jugador;
});
exports.actualizarJugador = actualizarJugador;
const eliminarJugador = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const jugador = yield prisma_service_1.default.jugadores.delete({
        where: {
            id: id,
        },
    });
    return jugador;
});
exports.eliminarJugador = eliminarJugador;
const existeEmail = (correo) => __awaiter(void 0, void 0, void 0, function* () {
    const jugador = yield prisma_service_1.default.invitados.findUnique({
        where: {
            correo,
        },
    });
    return jugador !== null;
});
exports.existeEmail = existeEmail;
const existeId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const jugador = yield prisma_service_1.default.jugadores.findUnique({
        where: {
            id,
        },
    });
    return jugador !== null;
});
exports.existeId = existeId;
const existeTelf = (telf) => __awaiter(void 0, void 0, void 0, function* () {
    const jugador = yield prisma_service_1.default.invitados.findUnique({
        where: {
            telf,
        },
    });
    return jugador !== null;
});
exports.existeTelf = existeTelf;
