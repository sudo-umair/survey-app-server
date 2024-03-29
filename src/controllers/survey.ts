import { RequestHandler } from 'express';
import { SurveyModel } from '@models/survey';
import { EnumeratorModel } from '@models/enumerator';
import { StatusCodes } from 'http-status-codes';
import {
  ICreateSurveyRequest,
  IDeleteSurveyRequest,
  IGetSurveyRequest,
  IResponse,
  ISyncSurveysRequest,
} from '@interfaces/controllers';

export const createSurvey: RequestHandler<
  {},
  IResponse,
  ICreateSurveyRequest
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const {
      surveyId,
      sectionA,
      sectionB,
      sectionC,
      sectionD,
      submittedAt,
      submittedBy,
      token,
    } = req.body;

    if (
      !surveyId ||
      JSON.stringify(sectionA) === '{}' ||
      JSON.stringify(sectionB) === '{}' ||
      JSON.stringify(sectionC) === '{}' ||
      JSON.stringify(sectionD) === '{}' ||
      JSON.stringify(submittedBy) === '{}' ||
      !submittedAt ||
      !token
    ) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }

    const existingEnumerator = await EnumeratorModel.findOne({
      email: submittedBy.email,
    });

    if (!existingEnumerator) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Enumerator not found',
      });
    } else {
      await existingEnumerator.verifyAuthToken(token).then(async (isMatch) => {
        if (isMatch) {
          if (existingEnumerator.isDisabled) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
              message: 'Enumerator is disabled, cannot submit survey',
            });
          } else {
            const survey = new SurveyModel({
              surveyId,
              sectionA,
              sectionB,
              sectionC,
              sectionD,
              submittedAt,
              submittedBy,
            });
            await survey
              .save()
              .then((survey) => {
                res.status(StatusCodes.CREATED).json({
                  message: 'Survey submitted successfully',
                  survey,
                });
              })
              .catch((error) => {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                  message: 'Something went wrong',
                });
                console.error(error);
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

export const syncSurveys: RequestHandler<
  {},
  IResponse,
  ISyncSurveysRequest
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const { email, token, surveys } = req.body;
    if (!email || !token || !surveys) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }
    const existingEnumerator = await EnumeratorModel.findOne({
      email: email,
    });
    if (!existingEnumerator) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Enumerator not found',
      });
    } else {
      await existingEnumerator.verifyAuthToken(token).then(async (isMatch) => {
        if (isMatch) {
          if (existingEnumerator.isDisabled) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
              message: 'Enumerator is disabled, cannot sync surveys',
            });
          } else {
            await SurveyModel.insertMany(surveys)
              .then((surveys) => {
                res.status(StatusCodes.CREATED).json({
                  message: 'Surveys synced',
                  surveys,
                });
              })
              .catch((error) => {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                  message: 'Something went wrong',
                });

                console.error(error);
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

export const getSurvey: RequestHandler<
  {},
  IResponse,
  IGetSurveyRequest
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const { email, surveyId, token } = req.body;
    if (!email || !surveyId || !token) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }
    const existingEnumerator = await EnumeratorModel.findOne({
      email: email,
    });
    if (!existingEnumerator) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Enumerator not found',
      });
    } else {
      await existingEnumerator.verifyAuthToken(token).then(async (isMatch) => {
        if (isMatch) {
          await SurveyModel.find({}).then((survey) => {
            if (survey.length > 0) {
              res.status(StatusCodes.OK).json({
                message: 'Survey found',
                survey,
              });
            } else {
              res.status(StatusCodes.NOT_FOUND).json({
                message: 'Survey not found',
              });
            }
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

export const deleteSurvey: RequestHandler<
  {},
  IResponse,
  IDeleteSurveyRequest
> = async (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Request body is empty',
    });
    return;
  }
  try {
    const { email, token, id } = req.body;
    if (!email || !token || !id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields',
      });
      return;
    }
    const existingEnumerator = await EnumeratorModel.findOne({
      email: email,
    });
    if (!existingEnumerator) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Enumerator not found',
      });
    } else {
      await existingEnumerator.verifyAuthToken(token).then(async (isMatch) => {
        if (isMatch) {
          await SurveyModel.findByIdAndDelete(id).then((survey) => {
            if (survey) {
              res.status(StatusCodes.OK).json({
                message: 'Survey deleted',
              });
            } else {
              res.status(StatusCodes.NOT_FOUND).json({
                message: 'Survey not found',
              });
            }
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
