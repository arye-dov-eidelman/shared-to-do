class SessionsController < ApplicationController
  def new

  end

  def create
    if @user = User.find_by(email: session_params[:email])
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

  def session_params
    params.permit(:email, :password)
  end
end
