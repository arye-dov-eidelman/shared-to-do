class ListsController < ApplicationController
  before_action :find_list, only: [:show, :edit, :update, :destroy]

  def index
    @lists = List.all
  end

  def new
    @list = List.new
    add_empty_list_items
  end

  def create
    @list = List.new(list_params)
    if @list.save
      redirect_to @list
    else
      redirect_to new_list_path
    end
  end

  def show
    add_empty_list_items
  end

  def edit
    add_empty_list_items
  end

  def update
    @list.update(list_params)
    redirect_to @list
  end

  def destroy
    @list.destroy
    redirect_to lists_path
  end

  private

  def find_list
    not_found unless @list = List.find_by(params[:id])
  end

  def add_empty_list_items
    5.times{ @list.items.build }
  end

  def list_params
    params.require(:list).permit(:name, items_attributes: [:name, :checked])
  end
end
