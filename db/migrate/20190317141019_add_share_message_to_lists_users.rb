class AddShareMessageToListsUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :lists_users, :share_message, :string, required: true
  end
end
