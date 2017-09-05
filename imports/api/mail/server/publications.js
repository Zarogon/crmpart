import { Meteor } from 'meteor/meteor';
import { Emails } from '../emails.js';
import {EmailCounters} from '../emails.js'
Meteor.publish('emails', function(params) {
    return Emails.find(params || {});
});
Meteor.publish('emailcounters', function(params) {
    return EmailCounters.find(params || {});
});