import {Meteor} from 'meteor/meteor';
import {History} from '../settings/history.js'
import {Contacts} from './contacts.js';

Meteor.methods({
    updateContactData(id, data) {
        try {
            Contacts.update({_id: id}, data)

            return true
        } catch (exception) {
            console.log("Update Contact - ERROR LOG:", exception)
            return false
        }
    },
    updateContactAdditional(id, data, param) {
        try {
            let key = 'additional.'.concat(param)

            Contacts.update({_id: id}, {$set: {[key]: data}})

            return true
        } catch (exception) {
            console.log("Update Contact - ERROR LOG:", exception)
            return false
        }
    },
    updateContact(id, field_id, value, userid) {
        try {
          var old =  Contacts.findOne({ _id: id }).fields.filter(function (field) {return field.field_id === field_id})[0].value

            Contacts.update({_id: id,"fields.field_id": field_id}, {$set: {"fields.$.value": value }} );

            console.log('Update Contact OK.');
            History.insert({
              user: userid,
              module: 'Contacts',
              action:'modify',
              object:id,
              field_id: field_id,
              old_value: old,
              new_value:value
            })

        } catch (exception) {
            console.log(exception);
            return exception;
        }
    },

    insertContact(data, userid, importing) {

        var newContactId = Contacts.insert(data);
        if(!importing){
            History.insert({
                user: userid,
                module: 'Contacts',
                action:'create',
                object:newContactId
            })
        }

        return newContactId;
    },
    getConvertedContacts(userid) {
        return Contacts.find({assigned: userid, converted: true})
    },
    getNewContactsCount(query){
        return Contacts.find(query).count() || false
    },
    getContacts(query){
        let contacts = Contacts.find(query)

        return contacts ? contacts.fetch() : []
    },
    getContactName(id){
        let contact = Contacts.findOne(id)
        return contact.name || false
    },
    getContactBy(query) {
        let contact = Contacts.findOne(query)
        console.log('from server: ',contact)
        return contact || false
    },
});
