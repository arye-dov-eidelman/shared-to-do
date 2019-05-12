class AddOwnerIdToLists < ActiveRecord::Migration[5.2]
  def change
    add_column :lists, :owner_id, :integer
  end
end
