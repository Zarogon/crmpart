import { Meteor } from 'meteor/meteor';
import { Contacts } from '../../api/contacts/contacts.js';
// // Import layout template
import '../../ui';

Router.configure({
    // layoutTemplate: 'mainLayout',
    loadingTemplate: 'page-loader',
    notFoundTemplate: 't404',
});

Router.onBeforeAction('loading');

Router.onBeforeAction(function() {
    // all properties available in the route function
    // are also available here such as this.params
    if (!Meteor.userId()) {
        // if the user is not logged in, render the Login template
        this.layout('blankLayout');
        this.render('login');
    } else {
        // otherwise don't hold up the rest of hooks or our route/action function
        // from running
        this.layout('mainLayout', { data: { filter: false } });
        this.next();
    }
});

Router.route('/contact/:id', {
    name: 'contact',
    waitOn: function() {
        return [
            Meteor.subscribe('roles'),
            Meteor.subscribe('contacts', { _id: this.params.id }),
        ];
    },
    onBeforeAction: function() {
        let doc = Contacts.findOne({ _id: this.params.id });
        if (doc) {
            if (!Roles.userCan(Meteor.userId(), 'contacts', 'view')) {
                this.render('t403');
            } else {
                this.next();
                return document.title = TAPi18n.__('contacts') + ' - ' + doc.name;
            }
        } else {
            this.render('t404');
        }
    },
    action: function() {
        Methods.setViewModule('contacts');
        this.render('contactDetails');
    },
    data: function() {
        return Contacts.findOne(this.params.id);
    },
});

