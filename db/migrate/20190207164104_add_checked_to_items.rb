class AddCheckedToItems < ActiveRecord::Migration[5.2]
  def change
    add_column(:items, :checked, :boolean, default: false)
  end
end
