const config = require('config');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.get('mailing').apiKey);

module.exports = (to, from, subject, html, attachments) => {
  sgMail.send({
    to,
    from,
    subject,
    html,
    attachments,
  });
};
