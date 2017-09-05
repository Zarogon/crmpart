import './routes.js';

const userLanguage = () => {
    // If the user is logged in, retrieve their saved language
    if (Meteor.user()) return Meteor.user().profile.language;
};

if (Meteor.isClient) {
    Meteor.startup(() => {
        $('body').toggleClass('fix-header', true);

        Tracker.autorun(() => {
            let lang;
            if (userLanguage()) {
                lang = userLanguage();
            } else {
                // If no user language, try setting by browser (default en)
                const localeFromBrowser =
                    window.navigator.userLanguage || window.navigator.language;
                let locale = 'en';

                if (localeFromBrowser.match(/en/)) {locale = 'en';}
                if (localeFromBrowser.match(/de/)) {locale = 'de';}
                if (localeFromBrowser.match(/fr/)) {locale = 'fr';}

                lang = locale;
            }

            TAPi18n.setLanguage(lang)
                .done(function handleDone() {})
                .fail(function handleFail() {});
        });
    });
}
