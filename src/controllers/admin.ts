import { RequestHandler } from 'express';
import { AdminModel } from '@models/admin';
import { StatusCodes } from 'http-status-codes';
import {
  ICreateAdminRequest,
  IGetUserRequest,
  IGetStatsRequest,
  IListSurveysRequest,
  IListEnumeratorsRequest,
  IResponse,
  IResumeSessionRequest,
  IToggleEnumeratorStatusRequest,
  IListSurveysRequestBySurveyId,
} from '@interfaces/controllers';
import { SurveyModel } from '@models/survey';
import { EnumeratorModel } from '@models/enumerator';
import { SURVEY_COMPONENTS } from '@interfaces/common';

export const createAdmin: RequestHandler<
  {},
  IResponse,
  ICreateAdminRequest
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }
    await AdminModel.findOne({ email })
      .then(async (admin) => {
        if (admin) {
          res.status(StatusCodes.CONFLICT).json({
            message: 'Admin already exists',
          });
        } else {
          const admin = new AdminModel({
            name,
            email,
            password,
          });
          admin
            .encryptPassword(password)
            .then(() => {
              res.status(StatusCodes.CREATED).json({
                message: 'Admin created successfully',
              });
            })
            .catch((error) => {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong',
              });
              console.error(error);
            });
        }
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Something went wrong',
        });
        console.error(error);
      });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

export const getAdmin: RequestHandler<{}, IResponse, IGetUserRequest> = async (
  req,
  res
) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }

    await AdminModel.findOne({ email })
      .then((admin) => {
        if (admin) {
          admin
            .comparePassword(password)
            .then((isMatch) => {
              if (isMatch) {
                admin.generateAuthToken();
                res.status(StatusCodes.OK).json({
                  message: 'Admin logged in successfully',
                  admin,
                });
              } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                  message: 'Incorrect password',
                });
              }
            })
            .catch((error) => {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong',
              });
              console.error(error);
            });
        } else {
          res.status(StatusCodes.NOT_FOUND).json({
            message: 'Admin not found',
          });
        }
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Something went wrong',
        });
        console.error(error);
      });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

export const resumeSession: RequestHandler<
  {},
  IResponse,
  IResumeSessionRequest
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }
    const existingAdmin = await AdminModel.findOne({
      email: email,
    });
    if (!existingAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Admin not found',
      });
    } else {
      await existingAdmin.verifyAuthToken(token).then((isMatch) => {
        if (isMatch) {
          res.status(StatusCodes.OK).json({
            message: `Admin ${existingAdmin.name} logged in successfully`,
            admin: existingAdmin,
          });
        } else {
          res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Invalid token',
          });
        }
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

export const listEnumerators: RequestHandler<
  {},
  IResponse,
  IListEnumeratorsRequest
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }
    const existingAdmin = await AdminModel.findOne({
      email: email,
    });

    if (!existingAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Admin not found',
      });
    } else {
      await existingAdmin.verifyAuthToken(token).then(async (isMatch) => {
        if (isMatch) {
          const enumerators = await EnumeratorModel.find({});
          res.status(StatusCodes.OK).json({
            message: 'Enumerators found',
            enumerators,
          });
        } else {
          res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Invalid token',
          });
        }
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

export const toggleEnumeratorStatus: RequestHandler<
  {},
  IResponse,
  IToggleEnumeratorStatusRequest
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const { email, token, enumeratorEmail } = req.body;
    if (!email || !token || !enumeratorEmail) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }
    const existingAdmin = await AdminModel.findOne({
      email: email,
    });
    if (!existingAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Admin not found',
      });
    } else {
      await existingAdmin.verifyAuthToken(token).then(async (isMatch) => {
        if (isMatch) {
          const existingEnumerator = await EnumeratorModel.findOne({
            email: enumeratorEmail,
          });

          if (!existingEnumerator) {
            res.status(StatusCodes.NOT_FOUND).json({
              message: 'Enumerator not found',
            });
          } else {
            existingEnumerator.isDisabled = !existingEnumerator.isDisabled;
            await existingEnumerator.save();
            res.status(StatusCodes.OK).json({
              message: `Enumerator ${
                existingEnumerator.isDisabled ? 'disabled' : 'enabled'
              } successfully`,
              enumerator: existingEnumerator,
            });
          }
        } else {
          res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Invalid token',
          });
        }
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

export const listSurveys: RequestHandler<
  {},
  IResponse,
  IListSurveysRequest
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }
    const existingAdmin = await AdminModel.findOne({
      email: email,
    });
    if (!existingAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Admin not found',
      });
    } else {
      await existingAdmin.verifyAuthToken(token).then(async (isMatch) => {
        if (isMatch) {
          const surveys = await SurveyModel.find({});
          res.status(StatusCodes.OK).json({
            message: 'Surveys found',
            surveys,
          });
        } else {
          res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Invalid token',
          });
        }
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

export const listSurveysBySurveyId: RequestHandler<
  {},
  IResponse,
  IListSurveysRequestBySurveyId
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const { surveyId, email, token } = req.body;
    if (!email || !token || !surveyId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }
    const existingAdmin = await AdminModel.findOne({
      email: email,
    });
    if (!existingAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Admin not found',
      });
    } else {
      await existingAdmin.verifyAuthToken(token).then(async (isMatch) => {
        if (isMatch) {
          const surveys = await SurveyModel.find({ surveyId });
          res.status(StatusCodes.OK).json({
            message: 'Surveys found',
            surveys,
          });
        } else {
          res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Invalid token',
          });
        }
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
  }
};

export const getStats: RequestHandler<{}, IResponse, IGetStatsRequest> = async (
  req,
  res
) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }
    const existingAdmin = await AdminModel.findOne({
      email: email,
    });
    if (!existingAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Admin not found',
      });
    } else {
      await existingAdmin.verifyAuthToken(token).then(async (isMatch) => {
        if (isMatch) {
          const surveys = await SurveyModel.find({});
          const surveys1 = surveys.filter(
            (survey) => survey.surveyId === SURVEY_COMPONENTS.S1
          ).length;
          const surveys2 = surveys.filter(
            (survey) => survey.surveyId === SURVEY_COMPONENTS.S2
          ).length;
          const surveys3 = surveys.filter(
            (survey) => survey.surveyId === SURVEY_COMPONENTS.S3
          ).length;
          const surveys4 = surveys.filter(
            (survey) => survey.surveyId === SURVEY_COMPONENTS.S4
          ).length;
          const surveys5 = surveys.filter(
            (survey) => survey.surveyId === SURVEY_COMPONENTS.S5
          ).length;
          const surveys6 = surveys.filter(
            (survey) => survey.surveyId === SURVEY_COMPONENTS.S6
          ).length;
          const surveys7 = surveys.filter(
            (survey) => survey.surveyId === SURVEY_COMPONENTS.S7
          ).length;

          const enumerators = await EnumeratorModel.find({});
          const totalEnumerators = enumerators.length;

          res.status(StatusCodes.OK).json({
            message: 'Stats found',
            stats: {
              totalSurveys: surveys.length,
              totalEnumerators,
              surveys1,
              surveys2,
              surveys3,
              surveys4,
              surveys5,
              surveys6,
              surveys7,
            },
          });
        } else {
          res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Invalid token',
          });
        }
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};
