import {Meteor} from 'meteor/meteor';
import {Mailboxes} from '../../api/settings/mailboxes';
import {Emails} from '../../api/mail/emails';

Meteor.methods({
    getAvailableMailBoxesQuery() {
        let user = Meteor.users.findOne({ _id: Meteor.userId() });

        if (!user) return [];

        let role = Meteor.roles.findOne({ _id: user.roles });

        if (!user.sites) return [];

        let userSites = user.sites.map(function map(userSite) {
            return { site: userSite };
        });

        if (!role && (!userSites && !userSites.length)) return [];

        if (!role.mail_options) return [];

        if (typeof role.mail_options === 'undefined') return [];

        let prm = _.find(role.mail_options, function find(el) {
            return el.option === 'send_mail';
        });

        if (!prm && !prm.flag) return [];

        let query = {
            $or: [
                {
                    $and: [
                        { $or: userSites },
                        { 'permissions.public': true },
                    ],
                },

                {
                    $and: [
                        { $or: userSites },
                        { 'permissions.roles': { $in: [user.roles] } },
                    ],
                },

                {
                    $and: [
                        { $or: userSites },
                        { 'permissions.users': { $in: [user._id] } },
                    ],
                },
            ],
        };

        return query;
    },
    
    sendEmail(maildata, mailboxid) {
        if (!maildata || !mailboxid) return (true, false);

        let mailbox = Mailboxes.findOne({_id: mailboxid});

        let transporter = nodemailer.createTransport({
            host: mailbox.smtp_host,
            port: mailbox.smtp_port,
            secure: mailbox.smtp_secure,
            tls: {rejectUnauthorized: false},
            auth: {
                user: mailbox.smtp_auth.smtp_username,
                pass: mailbox.smtp_auth.smtp_password,
            },
        });

        let mailOptions = {
            from: mailbox.address,
            to: maildata.addresses.map(el => el.email).join(', '),
            subject: maildata.subject,
            text: maildata.content ? strip(maildata.content) : '',
            html: maildata.content,
        };

        let email = {
            maildata: {
                attachments: [],
                headers: {},
                html: mailOptions.html || false,
                text: maildata.content ? strip(maildata.content) : '',
                subject: mailOptions.subject,
                date: new Date(),
                to: {
                    value: maildata.addresses.map( (el) => {
                        return {
                            address: el.email,
                            name: '',
                        };
                    }),
                },
                from: {
                    value: [{
                        address: mailOptions.from,
                        name: '',
                    }],
                },
                messageId: '',
                flags: ['\\Seen'],
                mailboxID: mailbox._id,
                path: 'INBOX.Sent',
            },
            maildate: new Date(),
            createdAt: new Date(),
        };

        if (maildata.attachments && maildata.attachments.length) {
            mailOptions.attachments = maildata.attachments.map(function(el) {
                el.content = new Buffer(el.content, 'binary');
                return el;
            });

            email.maildata.attachments = mailOptions.attachments;
        }

        return transporter.sendMail(mailOptions).then((result, error) => {
            if (error) return false;

            email.maildata.messageId = result.messageId;

            Emails.insert(email);

            return {result: result, email: email};
        });
    },
        getEmailChat(email, mailboxes) {
        if (!email || !mailboxes) return console.log('ERROR! SOME OF ATTRIBUTE MISSED!');
        let query = [];
        mailboxes.forEach(function (box) {
            query.push({
                'maildata.mailboxID': box['_id'],
                'maildata.path': 'INBOX',
                $or: [{
                    'maildata.to.value': {
                        $elemMatch: {
                            'address': email
                        }
                    }
                }, {
                    'maildata.from.value': {
                        $elemMatch: {
                            'address': email
                        }
                    }
                }]
            });
            query.push({
                'maildata.mailboxID': box['_id'],
                'maildata.path': 'INBOX.Sent',
                $or: [{
                    'maildata.to.value': {
                        $elemMatch: {
                            'address': email
                        }
                    }
                }, {
                    'maildata.from.value': {
                        $elemMatch: {
                            'address': email
                        }
                    }
                }]
            });
        });

        let emails = Emails.find({
            $or: query
        }, {
            sort: {
                'maildata.date': 1
            }
        }).fetch();

        return emails;
    }
});
