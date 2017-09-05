import {Mongo} from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import {Modules} from '../modules/modules'
export const Contacts = new Mongo.Collection('contacts', {
    _preventAutopublish: true
})
//define dynamic validation for this schema based on field settings for each module
let thismodule = Modules.findOne({'name': 'Contacts'})
let properties = {}
if(thismodule){
    thismodule.fields.forEach(function (el) {

        if(el.type === 'date' && (el.slug !=='createdAt') && (el.slug !=='updatedAt') ){
            properties[el.slug] = {
                type: Date,
                optional: true,
            }
        }
        else if (el.slug !=='createdAt' && el.slug !=='updatedAt'){
            properties[el.slug] = {
                type: String,
                optional: true,
            }
        }

    })
    properties['utm_source'] = {
        type: String,
        optional: true
    }
    properties['utm_medium'] = {
        type: String,
        optional: true
    }
    properties['utm_campaign'] = {
        type: String,
        optional: true
    }
    properties['utm_content'] = {
        type: String,
        optional: true
    }
    properties['utm_term'] = {
        type: String,
        optional: true
    }
    properties['ipaddr'] = {
        type: String,
        optional: true
    }
    properties['converted'] = {
        type: Boolean,
        optional: true,
        defaultValue: false,
    }
    properties['updatedAt'] = {
        type: Date,
        autoValue: function () {if (this.isUpdate || this.isUpsert) {return new Date()}},
        optional: true
    }
    properties['createdAt'] = {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date()
            }
            else if (this.isUpsert) {
                return {$setOnInsert: new Date()}
            }
            else {
                this.unset()
            }
        }
    },
    properties['additional'] = {
        type: Object,
        optional: true,
        blackbox: true
    }
    ContactSchema = new SimpleSchema(properties)

    Contacts.attachSchema(ContactSchema)

    Contacts.helpers({
        field: function() {
            return bcrm.getCDFN().id
        }
    })

    Contacts.deny({
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

}

