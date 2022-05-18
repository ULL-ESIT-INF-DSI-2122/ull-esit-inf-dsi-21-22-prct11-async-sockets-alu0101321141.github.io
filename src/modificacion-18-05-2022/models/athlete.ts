import { model, Schema } from "mongoose";
import { AthleteI } from "./interfaces/interfaceAthlete";

/**
 * Esquema del atleta
 */
export const athleteSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  NIF: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  expertProof: {
    type: String,
    required: true,
  },
  bestTime: {
    type: Number,
    required: true,
  },
});

/**
 * Modelo del athleta
 */
export const Athlete = model<AthleteI>("Athlete", athleteSchema);
