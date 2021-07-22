import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { name, email, old_password, password, phone_number, bio } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      id: userId,
      name,
      email,
      old_password,
      password,
      phone_number,
      bio
    });

    return response.json(classToClass(user));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ id: userId });

    return response.json(classToClass(user));
  }
}
