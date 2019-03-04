class SessionsController < ApplicationController
  def new

  end

  def create
    if omniauth?
      if @user = User.find_by(email: omniauth_info['email'])
        log_in!
        redirect_to lists_path
      else
        @user = User.new(
          email: omniauth_info['email'],
          name: omniauth_info['name'],
          password: SecureRandom.hex(32)
        )
        
        if @user.save
          log_in!
          redirect_to lists_path
        else
          redirect_to new_sessions_path
        end
      end
    elsif @user = User.find_by(email: session_params[:email])
      if @user.authenticate(session_params[:password])
        log_in!
        redirect_to lists_path
      else
        redirect_to new_sessions_path
      end
    else
      redirect_to new_sessions_path
    end
  end

  def destroy
    log_out!
    redirect_to new_sessions_path
  end

  private

  def session_params
    params.permit(:email, :password)
  end

  def omniauth?
    !!request.env['omniauth.auth']
  end

  def omniauth_info
    request.env['omniauth.auth']['info']
  end
end
