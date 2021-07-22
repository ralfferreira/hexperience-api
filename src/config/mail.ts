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
  driver: 'ethereal',
  defaults: {
    from: {
      name: 'Team Endeavour',
      email: 'devteam@endeavour.com'
    }
  }
} as IMailConfig;
