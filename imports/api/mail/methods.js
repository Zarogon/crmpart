import {Meteor} from 'meteor/meteor';
import {Emails} from './emails';
import {EmailCounters} from './emails';
import _ from 'underscore';

Meteor.methods({
    addFlag(messageId, flag) {
        Emails.update({'maildata.messageId': messageId},
            {$push: {'maildata.flags': flag}});
    },
    removeFlag(messageId, flag) {
        Emails.update({'maildata.messageId': messageId},
            {$pull: {'maildata.flags': flag}});
    },
    setFlags(messageId, flags) {
        Emails.update({'maildata.messageId': messageId},
            {$set: {'maildata.flags': flags}});
    },
    insertMail(data, path) {
        try {
            if (data && data.length) {
                data.forEach(function forEachData(email) {
                    let date = email['recieved-date'] || email.date;
                    let exists = Emails.findOne({'maildata.messageId': email.messageId});
                    if (!exists) {
                        console.log('inserting new email');
                        Emails.insert({maildata: email, maildate: date});
                    } else{
                        if(path && path === 'INBOX.Drafts') {
                            console.log('updating drafts');
                            Emails.update({'maildata.messageId': email.messageId}, {$set: {maildata: email, maildate: date}});
                        } else{
                            if(_.isEqual(exists.maildata.flags, email.flags)) {
                                return; //console.log('flags are identical, doing nothing')
                            }

                            console.log('flags on imap is differs, overwritting');
                            Emails.update({'maildata.messageId': email.messageId}, {$set: {maildata: email, maildate: date}});
                        }
                    }
                });
            }

            return true;
        } catch (exception) {
            console.log('Insert Email - ERROR LOG:', exception);
            return exception;
        }
    },
    getEmailBy(query) {
        let email = Emails.findOne(query);

        return email || false;
    },
    getUnreadCount(mailboxId, path) {
        let doc =  EmailCounters.findOne({'mailboxid': mailboxId, 'path': path});
        console.log(doc.count);
        return doc.count;
    },
    getEmailChat(email, mailboxes) {
        if (!email || !mailboxes) return console.log('ERROR! SOME OF ATTRIBUTE MISSED!');
        let query = [];
        mailboxes.forEach(function forEachBoxes(box) {
            query.push({'maildata.mailboxID': box._id, 'maildata.path': 'INBOX', $or: [{'maildata.to.value': {$elemMatch: {'address': email}}}, {'maildata.from.value': {$elemMatch: {'address': email}}}]});
            query.push({'maildata.mailboxID': box._id, 'maildata.path': 'INBOX.Sent', $or: [{'maildata.to.value': {$elemMatch: {'address': email}}}, {'maildata.from.value': {$elemMatch: {'address': email}}}]});
        });
        //console.log('query is: ', query)
        let emails = Emails.find({$or: query}, {sort: {'maildata.date': 1}}).fetch();
        //let emails = Emails.find({$or: query}).fetch()
        //console.log('emails found', emails)
        //return emails;

        //, { sort: { 'maildata.date': 1 } }

        return { $or: query };
    },
});
