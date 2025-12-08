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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// HARD-CODED FOR TESTING ONLY
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "eb20103087.minhajwahid@gmail.com",
        pass: "ietw vjjc yicc gxjs", // Gmail App Password
    },
});
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html, }) {
    try {
        yield transporter.sendMail({
            from: `Isai <eb20103087.minhajwahid@gmail.com>`, // FROM is also hard-coded
            to,
            subject,
            html,
        });
        console.log("Email sent successfully!");
    }
    catch (err) {
        console.error("Email error:", err);
        throw new Error("Failed to send email");
    }
});
exports.sendMail = sendMail;
