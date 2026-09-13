export default ({ config }) => {
  return {
    ...config,
    extra: {
      endpoint: process.env.EXPO_PUBLIC_ENDPOINT,
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      platform: process.env.EXPO_PUBLIC_PLATFORM,
      databaseId: process.env.EXPO_PUBLIC_DATABASE_ID,
      collectionId: process.env.EXPO_PUBLIC_COLLECTION_ID,
    },
  };
};
