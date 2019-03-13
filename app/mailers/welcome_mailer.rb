class WelcomeMailer < ApplicationMailer
  
  def welcome_email(user)
    @user = user
    send_email(
      to: @user.email,
      subject: 'Welcome to Shared To Do App',
      text: "Thank yoo #{@user.name} for signing up for Shared To Do App"
    )
  end

end
