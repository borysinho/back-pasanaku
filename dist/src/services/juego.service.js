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
exports.obtenerJuegosDeJugador = exports.obtenerJuegos = exports.obtenerJuego = exports.eliminarJuego = exports.actualizarJuego = exports.crearJuego = void 0;
const prisma_service_1 = __importDefault(require("./prisma.service"));
const crearJuego = (id_1, _a) => __awaiter(void 0, [id_1, _a], void 0, function* (id, { nombre, fecha_inicio, monto_total, moneda }) {
    try {
        const date = new Date(fecha_inicio);
        const juego = yield prisma_service_1.default.jugadores_Juegos.create({
            data: {
                jugador: { connect: { id } },
                juego: {
                    create: {
                        nombre,
                        fecha_inicio: date,
                        monto_total,
                        moneda,
                        estado_juego: "Nuevo",
                    },
                },
                rol: "Creador",
            },
        });
        return juego;
    }
    catch (error) {
        // console.log(error.message);
        throw new Error(`Error en juego.service.crearJuego. Message: ${error.message}`);
    }
});
exports.crearJuego = crearJuego;
const actualizarJuego = (id_juego_1, _b) => __awaiter(void 0, [id_juego_1, _b], void 0, function* (id_juego, { nombre, fecha_inicio, monto_total, moneda }) {
    // const date = new Date(fecha_inicio);
    const juego = yield prisma_service_1.default.juegos.update({
        where: {
            id: id_juego,
        },
        data: {
            nombre,
            fecha_inicio,
            monto_total,
            moneda,
        },
    });
    return juego;
});
exports.actualizarJuego = actualizarJuego;
const eliminarJuego = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const juego = yield prisma_service_1.default.juegos.delete({
        where: {
            id: id,
        },
    });
    return juego;
});
exports.eliminarJuego = eliminarJuego;
const obtenerJuego = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const juego = yield prisma_service_1.default.juegos.findUnique({ where: { id } });
    return juego;
});
exports.obtenerJuego = obtenerJuego;
const obtenerJuegos = () => __awaiter(void 0, void 0, void 0, function* () {
    const juegos = yield prisma_service_1.default.jugadores_Juegos.findMany({
        include: {
            jugador: {},
            juego: {},
        },
    });
    return juegos;
});
exports.obtenerJuegos = obtenerJuegos;
const obtenerJuegosDeJugador = (id_jugador) => __awaiter(void 0, void 0, void 0, function* () {
    const juegos = yield prisma_service_1.default.juegos.findMany({
        where: {
            jugadores_juegos: {
                some: {
                    id_jugador,
                },
            },
        },
    });
    return juegos;
});
exports.obtenerJuegosDeJugador = obtenerJuegosDeJugador;
