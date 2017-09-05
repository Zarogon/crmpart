import {Mongo} from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
export const Mailboxes = new Mongo.Collection('mailboxes', {
    _preventAutopublish: true,
});

MailboxesSchema = new SimpleSchema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    site: {
        type: String,
        optional: true
    },

    imap_host: {
        type: String,
    },
    imap_port: {
        type: String,
        defaultValue: "587"
    },
    imap_secure: {
        type: Boolean,
        defaultValue: false
    },
    imap_auth: {
        type: Object,
        blackbox: true
    },
    "imap_auth.$.imap_username": {
        type: String
    },
    "imap_auth.$.imap_password": {
        type: String
    },

    smtp_host: {
        type: String,
    },
    smtp_port: {
        type: String,
        defaultValue: "587"
    },
    smtp_secure: {
        type: Boolean,
        defaultValue: false
    },
    smtp_auth: {
        type: Object,
        blackbox: true
    },
    "smtp_auth.$.smtp_username": {
        type: String
    },
    "smtp_auth.$.smtp_password": {
        type: String
    },
    roles: {
        type: Array,
        optional: true,
    },
    "roles.$": {
        type: String,
        optional: true,

    },
    users: {
        type: Array,
        optional: true,
    },
    "users.$": {
        type: String,
        optional: true,
    },
    public: {
        type: Boolean,
        optional: true,
        defaultValue: true
    }
})

Mailboxes.attachSchema(MailboxesSchema)
Mailboxes.deny({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});