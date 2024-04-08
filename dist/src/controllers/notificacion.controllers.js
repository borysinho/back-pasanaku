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
exports.notificaciones = void 0;
const notificacion_service_1 = require("../services/notificacion.service");
const notificaciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idsInvitados } = req.body;
        const { id } = req.params;
        const mensajesWhatsapp = yield (0, notificacion_service_1.notificarPorWhatsapp)(parseInt(id), idsInvitados);
        // const mensajesCorreo = await enviarInvitacionCorreo(
        //   "quirogaborys@hotmail.com"
        // );
        return res.status(201).json({
            message: "Registro agregado correctamente",
            data: [mensajesWhatsapp],
            // data: [mensajesCorreo],
        });
    }
    catch (error) {
        return res.status(402).json({
            message: "Error en notificaciones.controller.testWhatsapp",
            error: error.message,
        });
    }
});
exports.notificaciones = notificaciones;
