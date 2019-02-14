class Lists::UsersController < ApplicationController
  before_action :require_logged_in_user
  before_action :find_list

  def new

  end

  def create

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

  def find_list
    not_found unless @list = List.find_by(id: params[:list_id])
    not_found unless @list.accessible_by?(@user)
  end
end
