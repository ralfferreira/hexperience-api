import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateScheduleService from '@modules/experiences/services/CreateScheduleService';
import CancelScheduleService from '@modules/experiences/services/CancelScheduleService';

export default class SchedulesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const hostId = request.user.hostId;
    const { date, experience_id } = request.body;

    const createSchedule = container.resolve(CreateScheduleService);

    const schedule = await createSchedule.execute({
      date,
      experience_id,
      host_id: hostId
    })

    return response.json(schedule);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const hostId = request.user.hostId;
    const { schedule_id, reason } = request.body;

    const cancelSchedule = container.resolve(CancelScheduleService);

    await cancelSchedule.execute({
      host_id: hostId,
      schedule_id,
      reason
    });

    return response.status(204).json({});
  }
}
