import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from 'typeorm/entities/users/User';
import { CustomError, ErrorValidation } from 'utils/response/CustomError';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  let { username, name } = req.body;
  const errorsValidation: ErrorValidation[] = [];
  const userRepository = getRepository(User);

  username = !username ? '' : username;
  name = !name ? '' : name;

  const user = await userRepository.findOne({ username });
  if (user) {
    errorsValidation.push({ username: `Username '${username}' already exists` });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Edit user validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
