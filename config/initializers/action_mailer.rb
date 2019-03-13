Rails.application.configure do
  config.action_mailer.delivery_method = :smtp
  # SMTP settings for mailgun
  ActionMailer::Base.smtp_settings = {
    :port           => 587,
    :address        => "smtp.mailgun.org",
    :domain         => Rails.application.credentials.mailgun['domain'],
    :user_name      => Rails.application.credentials.mailgun['username'],
    :password       => Rails.application.credentials.mailgun['password'],
    :authentication => :plain,
  }
end