class ListsController < ApplicationController
  before_action :require_logged_in_user
  before_action :find_list, only: [:show, :edit, :update, :destroy]

  def index
    @query = search_params[:query]
    @lists = @user.lists
      .where("name LIKE ?", "%#{@query}%")
      .order(updated_at: :desc)

    respond_to do |format|
      format.html {}

      format.json do
        render json: @lists, each_serializer: Lists::IndexSerializer
      end
    end
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
    @items = [@list.items.incomplete, 5.times.collect{@list.items.build}, @list.items.complete].flatten
  end

  def list_params
    params.require(:list).permit(:name, items_attributes: [:id, :name, :checked])
  end

  def search_params
    params.permit(:query)
  end
end
