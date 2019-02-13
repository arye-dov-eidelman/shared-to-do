class ApplicationController < ActionController::Base
  private

  def require_logged_in_user
    unless current_user
      redirect_to new_sessions_path
    end
  end

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  def log_in!
    session[:user_id] = @user.id
  end

  def log_out!
    session.delete(:user_id)
  end

  def logged_in?
    session[:user_id].kind_of?(Integer) &&
    @user = User.find_by(id: session[:user_id])
  end

  def logged_out?
    !logged_in?
  end

  def current_user
    if logged_in?
      return @user
    else
      return false
    end
  end
end
