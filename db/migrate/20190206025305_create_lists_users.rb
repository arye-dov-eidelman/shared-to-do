class CreateListsUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :lists_users do |t|
      t.integer :list_id
      t.integer :user_id
      t.integer :is_owner

      t.timestamps
    end
  end
end
