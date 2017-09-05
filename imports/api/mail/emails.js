import {Mongo} from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
export const Emails = new Mongo.Collection('emails', {_preventAutopublish: true})
export const EmailCounters = new Mongo.Collection('emailcounters', {_preventAutopublish: true})

EmailCountersSchema = new SimpleSchema({
    mailboxid: {
        type: String,
    },
    count:{
        type: Number
    },
    path:{
        type: String,
    },

})

EmailsSchema = new SimpleSchema({
    maildata: {
        type: Object,
        blackbox: true
    },
    flags:{
        type:Array,
        blackbox:true,
        optional:true

    },
    "flags.$":{
      type: String,
        optional:true
    },
    maildate: {
        type: Date,
        optional:true
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset(); // Prevent user from supplying their own value
            }
        }
    },
})

Emails.attachSchema(EmailsSchema)
EmailCounters.attachSchema(EmailCountersSchema)

Emails.deny({
    insert: function() {
        return true
    },
    update: function() {
        return true
    },
    remove: function() {
        return true
    }
})
EmailCounters.deny({
    insert: function() {
        return true
    },
    update: function() {
        return true
    },
    remove: function() {
        return true
    }
})
