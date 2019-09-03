const config = require('config');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.get('mailing').apiKey);

module.exports = async (to, from, subject, html, attachments) => {
  await sgMail.send({
    to,
    from,
    subject,
    html,
    attachments,
  });
};
