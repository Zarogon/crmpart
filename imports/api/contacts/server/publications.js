import { Meteor } from 'meteor/meteor';
import { Contacts } from '../contacts.js';

Meteor.publish('contacts', function(opt) {
        return Contacts.find(opt || {});
})
