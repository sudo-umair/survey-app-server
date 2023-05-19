import { RequestHandler } from 'express';
import { AdminModel } from '@models/admin';
import { StatusCodes } from 'http-status-codes';
import type { IAdmin } from '@/types/admin';

const createAdmin: RequestHandler = async (req, res) => {
  try {
    const { name, password, email } = req.body as IAdmin;
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
          admin.encryptPassword(password);
          await admin
            .save()
            .then((admin) => {
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

const getAdmin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as IAdmin;
    await AdminModel.findOne({ email })
      .then((admin) => {
        if (admin) {
          admin
            .comparePassword(password)
            .then((isMatch) => {
              if (isMatch) {
                admin.generateAuthToken();
                res.status(StatusCodes.OK).json({
                  message: 'Admin found',
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

const updateAdmin: RequestHandler = async (req, res) => {
  try {
    const { password, email, oldPassword } = req.body as IAdmin & {
      oldPassword: string;
    };
    await AdminModel.findOne({ email }).then((admin) => {
      if (admin) {
        admin.comparePassword(oldPassword).then((isMatch) => {
          if (isMatch) {
            admin.email = email;
            admin.encryptPassword(password);
            res.status(StatusCodes.OK).json({
              message: 'Admin updated successfully',
              admin,
            });
          } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
              message: 'Incorrect password',
            });
          }
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          message: 'Admin not found',
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

const deleteAdmin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as IAdmin;
    AdminModel.findOne({ email }).then((admin) => {
      if (admin) {
        admin.comparePassword(password).then((isMatch) => {
          if (isMatch) {
            admin.deleteOne();
            res.status(StatusCodes.OK).json({
              message: 'Admin deleted successfully',
            });
          } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
              message: 'Incorrect password',
            });
          }
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          message: 'Admin not found',
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

export { createAdmin, getAdmin, updateAdmin, deleteAdmin };
