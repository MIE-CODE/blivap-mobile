export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  env: process.env.EXPO_PUBLIC_APP_ENV,
} as const;

for (const key of Object.keys(config)) {
  if (!config[key as keyof typeof config]) {
    throw new Error(`EXPO_PUBLIC_${key} is not set — check your .env file`);
  }
}
