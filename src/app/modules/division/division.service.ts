import { constants } from "http2";
import AppError from "../../error/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
  const baseSlug = payload.name.toLowerCase().split(" ").join("-");
  const slug = `${baseSlug}-division`;
  payload.slug = slug;
  const division = await Division.create(payload);
  return division;
};

const getAllDivisions = async () => {
  const divisions = await Division.find();
  return divisions;
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  if (!division) {
    throw new AppError(constants.HTTP_STATUS_NOT_FOUND, "Division not found");
  }
  return division;
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const division = await Division.findById(id);
  if (!division) {
    throw new AppError(constants.HTTP_STATUS_NOT_FOUND, "Division not found");
  }
  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (duplicateDivision) {
    throw new AppError(
      constants.HTTP_STATUS_CONFLICT,
      "Division name already exists"
    );
  }
  if (payload.name) {
    const baseSlug = payload.name.toLowerCase().split(" ").join("-");
    const slug = `${baseSlug}-division`;
    payload.slug = slug;
  }
  division.set(payload);
  await division.save();
  return division;
};

const deleteDivision = async (id: string) => {
  const division = await Division.findById(id);
  if (!division) {
    throw new AppError(constants.HTTP_STATUS_NOT_FOUND, "Division not found");
  }
  await division.deleteOne();
};

export const DivisionService = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
