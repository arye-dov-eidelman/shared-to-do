class ListsUser < ApplicationRecord
  belongs_to :list
  belongs_to :user

  validates :list_id, :user_id, :is_owner, presence: true

  # validates that there are no double user list relations
  validates :user_id, uniqueness: {scope: :list_id}

  scope :is_owner, -> { where(is_owner: true) }
  scope :is_not_owner, -> { where(is_owner: false) }

  scope :shared_list_ids, -> {
    group(:list_id).having("COUNT(list_id) > 1").pluck(:list_id)
  }

  scope :non_shared_list_ids, -> {
    group(:list_id).having("COUNT(list_id) = 1").pluck(:list_id)
  }
end
