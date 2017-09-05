import {Meteor} from 'meteor/meteor'
import {Settings} from '../settings.js'
import {Calendar} from '../calendar.js'
import {History} from '../history.js'
import {Trash} from '../history.js'
import {Webforms} from '../webforms'
import {Numcodes} from '../numcodes'
import {Filtertypes} from '../filtertypes'
import {Filters} from '../filters'
import {SMS} from '../sms'
import {Mailboxes} from '../mailboxes'

Meteor.publish('settings', function(query) {
    return Settings.find(query || {});
});
Meteor.publish('calendar', function(query) {
    return Calendar.find(query || {});
});
Meteor.publish('history', function(query) {
    return History.find(query || {});
});
Meteor.publish('trash', function(query) {
    return Trash.find(query || {});
});
Meteor.publish('webforms', function(query) {
    return Webforms.find(query || {});
});
Meteor.publish('numcodes', function(query) {
    return Numcodes.find(query || {});
});
Meteor.publish('filtertypes', function(query) {
    return Filtertypes.find(query || {});

});
Meteor.publish('filters', function(query) {
    return Filters.find(query || {});

});
Meteor.publish('sms', function(query) {
    return SMS.find(query || {});
});
Meteor.publish('mailboxes', function(query) {
    return Mailboxes.find(query || {});
});