class ListsUser < ApplicationRecord
  belongs_to :list
  belongs_to :user

  validates :list_id, :user_id, :is_owner, presence: true
end
