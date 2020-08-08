var languages = require("../i18n");

translate = (language, key, subkey, inject = []) => {
    let translatedText;
    if (language in languages) {
        translatedText = languages[language][key][subkey];
    } else {
        translatedText = languages['en'][key][subkey];
    }

    if (inject.length) {
        for (let toInject of inject) {
            const toCheck = `{{${Object.keys(toInject)[0]}}}`;
            if (translatedText.includes(toCheck)) {
                const toReplaceWith = Object.values(toInject)[0];
                translatedText = translatedText.replace( new RegExp( toCheck, 'g' ), toReplaceWith );
            }
        }
    }
    return translatedText;
}

module.exports = {
    translate
}