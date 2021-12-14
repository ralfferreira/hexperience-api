interface IAuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
  }
}

export default {
  jwt: {
    secret: global.env.APP_SECRET,
    expiresIn: '1d'
  }
} as IAuthConfig;
