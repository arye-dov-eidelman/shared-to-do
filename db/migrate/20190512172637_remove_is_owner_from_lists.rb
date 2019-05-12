class RemoveIsOwnerFromLists < ActiveRecord::Migration[5.2]
  def change
    remove_column :lists, :is_owner, :boolean
  end
end
