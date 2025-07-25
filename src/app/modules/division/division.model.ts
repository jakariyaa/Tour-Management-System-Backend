import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

divisionSchema.pre("validate", async function (next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-").concat("-division");
  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
