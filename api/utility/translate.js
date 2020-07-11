var languages = require("../../i18n");

translate = (language, key, subkey) => {
    if (language in languages) {
        return languages[language][key][subkey];
    }
    return languages['en'][key][subkey];
}

module.exports = {
    translate
}