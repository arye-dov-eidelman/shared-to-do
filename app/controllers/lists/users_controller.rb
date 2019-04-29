class Lists::UsersController < ApplicationController
  before_action :require_logged_in_user
  before_action :find_list

  def new
    @lists_user = @list.lists_users.build
  end

  def create
    @lists_user = @list.share(
      with: User.find_by(id: list_user_params[:user_id]),
      by: @user,
      message: list_user_params[:share_message]
    )
    if @lists_user.save
      redirect_to list_users_path(@list)
    else
      render :new
    end
  end

  def index

  end

  def destroy
    not_found unless @other_user = @list.users.find_by(id: params[:id])
    if @other_user == @list.owner
      # connot remove owner
    else
      @list.unshare_with(@other_user)
    end
    
    redirect_to list_users_path(@list)

  end

  private

  def list_user_params
    params.require(:lists_user).permit(:user_id)
  end

  def find_list
    not_found unless @list = List.find_by(id: params[:list_id])
    not_found unless @list.accessible_by?(@user)
  end
end
