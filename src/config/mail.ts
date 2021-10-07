interface IMailConfig {
  driver: 'ethereal',
  defaults: {
    from: {
      name: string,
      email: string,
    }
  }
}

export default {
  driver: global.env.MAIL_DRIVER,
  defaults: {
    from: {
      name: 'Team Endeavour',
      email: 'devteam@endeavour.com'
    }
  }
} as IMailConfig;
