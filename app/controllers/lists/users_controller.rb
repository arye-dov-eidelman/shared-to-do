class Lists::UsersController < ApplicationController
  before_action :require_logged_in_user
  before_action :find_list

  def new

  end

  def create

  end

  def index
    # byebug
  end

  def destroy

  end

  private

  def find_list
    not_found unless @list = List.find_by(id: params[:list_id])
    not_found unless @list.accessible_by?(@user)
  end
end
