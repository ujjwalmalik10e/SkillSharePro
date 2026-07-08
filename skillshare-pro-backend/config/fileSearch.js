import ai from "./gemini.js";

export async function getOrCreateFileStore() {
  const STORE_NAME = "SkillSharePro";

  const stores = await ai.fileSearchStores.list();

  for await (const store of stores) {
    if (store.displayName === STORE_NAME) {
      return store;
    }
  }

  const operation = await ai.fileSearchStores.create({
    config: {
      displayName: STORE_NAME,
    },
  });

  return operation;
}