/*jshint esversion: 6 */

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {$} from 'meteor/jquery';
import {Contacts} from '../../../api/contacts/contacts.js';
import {CMethods} from '../../../startup/client/methods';
import {Mailboxes} from '../../../api/settings/mailboxes.js';
import {Emails} from '../../../api/mail/emails';
import './contact.html';

const Methods = require('../../../startup/both/methods');

Template.contactDetails.onCreated(function onCreate() {
    const template = this;
    let id = Router.current().params.id;
    let contact = Contacts.findOne({_id: id});
    if(contact.email) {
        Meteor.call('getAvailableMailBoxesQuery', (error, mailboxes) => {
            if (mailboxes) {
                template.subscribe('mailboxes', mailboxes);
                let allUserMailboxes = Mailboxes.find({}).fetch();

                template.mailboxes = allUserMailboxes
                    .filter(box => (!('permission.public' in box) &&
                    box.site === contact.site));

                Meteor.call('getEmailChat', contact.email,
                    template.mailboxes, (error, chat) => {
                        if (chat) {
                            template.subscribe('emails', chat);
                        }
                    });
            }
        });
    }
});

Template.contactDetails.events({
    'click [data-action=send-chat-message]': function sendChatMessge(e) {
        e.preventDefault();
        const id = Router.current().params.id;
        const contact = Contacts.findOne({_id: id});

        const $chatInput = $(e.target).closest('.chatInput');
        const $chatText = $chatInput.find('textarea');
        const $fromSelect = $chatInput.find('.chat-send-from');

        const message = $chatText.val();

        if (message) {
            const maildata = {
                content: message,
                addresses: [{name: '', email: contact.email}],
                subject: '',
                attachments: [],
            };

            console.log(maildata);

            Meteor.call('sendEmail', maildata,
                $fromSelect.val(), (error) => {
                    if (error) throw error;
                    const $chat = $('.chat');
                    $chatText.val('');
                    $chat.animate({ scrollTop: $chat.prop('scrollHeight') }, 500);
                });
        }
    },
});

Template.contactDetails.helpers({
    availableMailboxes: function() {
        return Template.instance().mailboxes || [];
    },
    
    chatEmail: function() {
        let chat = Emails.find({}).fetch();
        if(!chat.length) return [];

        return chat.map(function map(el) {
            el.maildata.date = CMethods.getTextDate(el.maildata.date);
            return el;
        });
    },
    contact: () => {
        let id = Router.current().params.id;
        let contact = Contacts.findOne({_id: id});

        return contact || '';
    },
});
