"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema, model = mongoose_1.default.model;
var AccommodationSchema = new Schema({
    name: { type: String, required: true, allowNull: false },
    description: { type: String, required: true, allowNull: false },
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true, allowNull: false },
    host: { type: Schema.Types.ObjectId, ref: "Users", required: true, allowNull: false },
    maxGuests: { type: Number, required: true, allowNull: false }
}, { timestamps: true });
AccommodationSchema.methods.toJSON = function () {
    var schema = this;
    var object = schema.toObject();
    delete object.__v;
    return object;
};
exports.default = model("Accommodation", AccommodationSchema);
