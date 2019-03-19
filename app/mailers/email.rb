# Take note: This is not the using (rails) ActionMail
#
# Email provides a wrapper for the mailgun api
# and methods for creating individual emails

class Email
  DOMAIN = Rails.application.credentials.mailgun[:domain]
  DEFAULT_FROM = "sharedtodo@#{DOMAIN}"
  DEFAULT_SUBJECT= "Shared To App"
  @@mailgun_client = Mailgun::Client.new(Rails.application.credentials.mailgun[:api_key])
  
  def initialize(options)
    options[:from] = DEFAULT_FROM unless options[:from]
    options[:subject] = DEFAULT_SUBJECT unless options[:subject]
    @options = options
    self
  end

  def send
    @@mailgun_client.send_message(DOMAIN, @options)
    self
  end
  
  def self.new_welcome_email(user)
    self.new({
      to: user.email,
      subject: 'Welcome to Shared To Do App',
      text: "Thank you #{user.name} for signing up for Shared To Do App"
    })
  end

  def self.sample_text_email
    self.new({
      to: "aryedov.e@gmail.com",
      subject: "Sample plain text email subject",
      text: <<-MESSAGE
        Sample html email body
        
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      MESSAGE
    })
  end

  def self.sample_html_email
    self.new({
      to: "aryedov.e@gmail.com",
      subject: "Sample HTML email subject",
      html: <<-MESSAGE
        <h1>Sample html email body</h1>
        <p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      MESSAGE
    })
  end
end
