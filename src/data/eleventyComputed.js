export default {
  t: (data) => {
    const lang = data.page?.lang || "en";

    return data.translations[lang] || data.translations.en;
  },
};
