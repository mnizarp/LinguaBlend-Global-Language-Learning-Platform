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
exports.language_list_unlist = exports.getLanguages = exports.addNewLanguage = void 0;
const languageModel_1 = require("../../models/languageModel");
const addNewLanguage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { language } = req.body;
        const languageInCapital = language.toUpperCase();
        const isExists = yield languageModel_1.Language.findOne({ language: languageInCapital });
        if (!isExists) {
            const newlanguage = new languageModel_1.Language({
                language: languageInCapital,
                flag: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
                list: true,
            });
            yield newlanguage.save();
            res.status(200).json({ message: "language added successfully" });
        }
        else {
            res.status(401).json({ message: "language already exists" });
        }
    }
    catch (error) {
        res.status(400).json({ message: "language adding failed" });
    }
});
exports.addNewLanguage = addNewLanguage;
const getLanguages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const languages = yield languageModel_1.Language.find({});
        if (languages.length > 0) {
            res.status(200).json({ languages });
        }
        else {
            res.status(401).json({ message: "language empty" });
        }
    }
    catch (error) {
        res.status(400);
        console.log(error);
    }
});
exports.getLanguages = getLanguages;
const language_list_unlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { languageId } = req.body;
        yield languageModel_1.Language.findByIdAndUpdate({ _id: languageId }, [
            {
                $set: {
                    list: {
                        $cond: {
                            if: { $eq: ["$list", true] },
                            then: false,
                            else: true,
                        },
                    },
                },
            },
        ]);
        res.status(200).json({ message: "list update done" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "list update failed" });
    }
});
exports.language_list_unlist = language_list_unlist;
