const config: any = {
  development: {
    apiUrl: 'https://www.hasmandrivingschool.com.au:2053/api/',
  },
}

export const baseConfig = (env: string) => {
  return config[env] || config.development
}
