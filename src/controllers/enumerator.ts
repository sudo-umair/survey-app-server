import { RequestHandler } from 'express';
import { EnumeratorModel } from '@models/enumerator';
import { StatusCodes } from 'http-status-codes';
import {
  ICreateEnumeratorRequest,
  IGetEnumeratorRequest,
  IResponse,
} from '@interfaces/controllers';

export const createEnumerator: RequestHandler<
  {},
  IResponse,
  ICreateEnumeratorRequest
> = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      enumeratorId,
      mobile,
      password,
      email,
      address,
      cnic,
    } = req.body;
    await EnumeratorModel.findOne({ email } || { enumeratorId })
      .then(async (enumerator) => {
        if (enumerator) {
          res.status(StatusCodes.CONFLICT).json({
            message: 'Enumerator already exists',
          });
        } else {
          const enumerator = new EnumeratorModel({
            name: `${firstName} ${lastName}`,
            age,
            enumeratorId,
            mobile,
            email,
            password,
            address,
            cnic,
          });
          await enumerator
            .encryptPassword(password)
            .then((enumerator) => {
              res.status(StatusCodes.CREATED).json({
                message: 'Enumerator created successfully',
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

export const getEnumerator: RequestHandler<
  {},
  IResponse,
  IGetEnumeratorRequest
> = async (req, res) => {
  try {
    const { email, password } = req.body;
    await EnumeratorModel.findOne({ email })
      .then(async (enumerator) => {
        if (enumerator) {
          await enumerator
            .comparePassword(password)
            .then(async (isMatch) => {
              if (isMatch) {
                enumerator.generateAuthToken();
                res.status(StatusCodes.OK).json({
                  message: 'Enumerator found',
                  enumerator,
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
            message: 'Enumerator not found',
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
