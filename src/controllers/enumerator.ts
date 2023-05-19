import { RequestHandler } from 'express';
import { EnumeratorModel } from '@models/enumerator';
import type { IEnumerator } from '@/types/enumerator';
import { StatusCodes } from 'http-status-codes';

const createEnumerator: RequestHandler = async (req, res) => {
  try {
    const { name, phone, password, email, address, cnic } =
      req.body as IEnumerator;
    await EnumeratorModel.findOne({ phone })
      .then(async (enumerator) => {
        if (enumerator) {
          res.status(StatusCodes.CONFLICT).json({
            message: 'Enumerator already exists',
          });
        } else {
          const enumerator = new EnumeratorModel({
            name,
            phone,
            email,
            password,
            address,
            cnic,
          });
          enumerator.encryptPassword(password);
          await enumerator
            .save()
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

const getEnumerator: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as IEnumerator;
    await EnumeratorModel.findOne({ email })
      .then((enumerator) => {
        if (enumerator) {
          enumerator
            .comparePassword(password)
            .then((isMatch) => {
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

const updateEnumerator: RequestHandler = async (req, res) => {
  try {
    const { password, name, email, phone, oldPassword } =
      req.body as IEnumerator & {
        oldPassword: string;
      };

    if (!password || !name || !email || !phone || !oldPassword) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Please provide all the required fields',
      });
      return;
    }

    await EnumeratorModel.findOne({ email }).then((enumerator) => {
      if (enumerator) {
        enumerator.comparePassword(oldPassword as string).then((isMatch) => {
          if (isMatch) {
            enumerator.name = name;
            enumerator.phone = phone;
            enumerator.email = email;
            enumerator.encryptPassword(password);
            res.status(StatusCodes.OK).json({
              message: 'Enumerator updated successfully',
              enumerator,
            });
          } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
              message: 'Incorrect password',
            });
          }
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          message: 'Enumerator not found',
        });
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

const deleteEnumerator: RequestHandler = async (req, res) => {
  try {
    const { phone, password } = req.body as IEnumerator;
    EnumeratorModel.findOne({ phone }).then((enumerator) => {
      if (enumerator) {
        enumerator.comparePassword(password).then((isMatch) => {
          if (isMatch) {
            enumerator.deleteOne();
            res.status(StatusCodes.OK).json({
              message: 'Enumerator deleted successfully',
            });
          } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
              message: 'Incorrect password',
            });
          }
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          message: 'Enumerator not found',
        });
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

export { createEnumerator, getEnumerator, updateEnumerator, deleteEnumerator };
