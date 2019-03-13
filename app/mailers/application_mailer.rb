class ApplicationMailer < ActionMailer::Base
  # default from: 'sharedtodo@sandbox46c2e5eff8b6423dba5fd5caf2bba7bc.mailgun.org'
  # layout 'mailer'
  attr_accessor :from, :to, :subject, :text
  DOMAIN = Rails.application.credentials.mailgun[:domain]
  FROM = "sharedtodo@#{DOMAIN}"

  def send_email(options)
    options.each{|k, v| self.send("#{k}=", v)}
    mg_client = Mailgun::Client.new(Rails.application.credentials.mailgun[:api_key])
    message_params = {
      from:    @from || FROM,
      to:      @to,
      subject: @subject || "Shared To App",
      text:    @text
    }
    mg_client.send_message(DOMAIN, message_params)
  end
end
