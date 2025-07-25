import { Request, Response } from "express";
import { constants } from "http2";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionService } from "./division.service";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const division = await DivisionService.createDivision(req.body);
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_CREATED,
    success: true,
    message: "Division created successfully",
    data: division,
  });
});

const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
  const divisions = await DivisionService.getAllDivisions();
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_OK,
    success: true,
    message: "Divisions retrieved successfully",
    data: divisions,
    meta: { total: divisions.length },
  });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const division = await DivisionService.getSingleDivision(req.params.slug);
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_OK,
    success: true,
    message: "Division retrieved successfully",
    data: division,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const { params, body } = req;
  const division = await DivisionService.updateDivision(params.id, body);
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_OK,
    success: true,
    message: "Division updated successfully",
    data: division,
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  await DivisionService.deleteDivision(req.params.id);
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_OK,
    success: true,
    message: "Division deleted successfully",
    data: null,
  });
});

export const DivisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
