class ListsController < ApplicationController
  before_action :require_logged_in_user
  before_action :find_list, only: [:show, :edit, :update, :destroy]

  def index
    @lists = @user.lists
  end

  def new
    @list = List.new
    add_empty_list_items
  end

  def create
    @list = List.new(list_params.merge({owner: @user}))
    if @list.save!
      redirect_to @list
    else
      render :edit
    end
  end

  def show
    add_empty_list_items
  end

  def edit
    add_empty_list_items
  end

  def update
    if @list.update(list_params)
      redirect_to @list
    else
      render :edit
    end
  end

  def destroy
    @list.destroy
    redirect_to lists_path
  end

  private

  def find_list
    not_found unless @list = List.find_by(id: params[:id])
    not_found unless @list.accessible_by?(@user)
  end

  def add_empty_list_items
    5.times{ @list.items.build }
  end

  def list_params
    params.require(:list).permit(:name, items_attributes: [:id, :name, :checked])
  end
end
