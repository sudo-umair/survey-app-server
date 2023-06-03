import { RequestHandler } from 'express';
import { AdminModel } from '@models/admin';
import { StatusCodes } from 'http-status-codes';
import {
  ICreateAdminRequest,
  IGetUserRequest,
  IIGetStatsRequest,
  IIListSurveysRequest,
  IListEnumeratorsRequest,
  IResponse,
  IResumeSessionRequest,
  IToggleEnumeratorStatusRequest,
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
  }
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
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
            message: 'Session resumed',
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
  }
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
    }

    const existingAdmin = await AdminModel.findOne({
      email: email,
    });

    if (!existingAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Admin not found',
      });
    } else {
      const enumerators = await EnumeratorModel.find({});
      res.status(StatusCodes.OK).json({
        message: 'Enumerators found',
        enumerators,
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
  }
  try {
    const { email, token, enumeratorEmail } = req.body;
    if (!email || !token || !enumeratorEmail) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
    }

    const existingAdmin = await AdminModel.findOne({
      email: email,
    });

    if (!existingAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Admin not found',
      });
    } else {
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
          message: 'Enumerator status updated',
        });
      }
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
  IIListSurveysRequest
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
  }
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
    }

    const existingAdmin = await AdminModel.findOne({
      email: email,
    });

    if (!existingAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Admin not found',
      });
    } else {
      const surveys = await SurveyModel.find({});
      res.status(StatusCodes.OK).json({
        message: 'Surveys found',
        surveys,
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

export const getStats: RequestHandler<
  {},
  IResponse,
  IIGetStatsRequest
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
  }
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
    }

    const existingAdmin = await AdminModel.findOne({
      email: email,
    });

    if (!existingAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Admin not found',
      });
    } else {
      const STATS = {
        totalSurveys: 0,
        totalEnumerators: 0,
        totalComponentASurveys: 0,
        totalComponentBSurveys: 0,
      };

      const surveys = await SurveyModel.find({});
      STATS.totalSurveys = surveys.length;

      const enumerators = await EnumeratorModel.find({});
      STATS.totalEnumerators = enumerators.length;

      const componentASurveys = await SurveyModel.find({
        surveyId: SURVEY_COMPONENTS.A,
      });
      STATS.totalComponentASurveys = componentASurveys.length;

      const componentBSurveys = await SurveyModel.find({
        surveyId: SURVEY_COMPONENTS.B,
      });
      STATS.totalComponentBSurveys = componentBSurveys.length;

      res.status(StatusCodes.OK).json({
        message: 'Stats found',
        stats: STATS,
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};
