const config: any = {
  development: {
    graphQLUrl: 'http://localhost:3000/graphql',
    restApiUrl: 'http://localhost:3001/api/',
    webSocketUrl: 'http://localhost:3002',
  },
}

export const baseConfig = (env: string) => {
  return config[env] || config.development
}
