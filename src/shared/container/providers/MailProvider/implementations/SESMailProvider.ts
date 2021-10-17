import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from "tsyringe";
import mailConfig from 'config/mail';
import aws from 'aws-sdk';

import IMailProvider from "../models/IMailProvider";
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from "../dtos/ISendMailDTO";

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor (
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    const ses = new aws.SES({
      apiVersion: '2010-12-01',
    });

    this.client = nodemailer.createTransport({
      SES: { ses, aws }
    })
  }

  public async sendMail({
    to,
    subject,
    templateData,
    from
  }: ISendMailDTO): Promise<void> {
    await this.client.sendMail({
      from: {
        name: from?.name || mailConfig.defaults.from.name,
        address: from?.email || mailConfig.defaults.from.email
      },
      to: {
        name: to.name,
        address: to.email
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData)
    });
  }
}

export default SESMailProvider;
