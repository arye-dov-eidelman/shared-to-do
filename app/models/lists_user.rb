class ListsUser < ApplicationRecord
  belongs_to :list
  belongs_to :user

  validates :list_id, presence: true
  validates :user, presence: { message: "Attempted to share a list without specifeing with whom" }

  # validates that there are no double user list relations
  validates :user_id, uniqueness: { scope: :list_id, message:
    ->(object, data) { "#{object.user.name} already has access to this list"}
  }

  # scope :shared_list_ids, -> {
  #   group(:list_id).having("COUNT(list_id) > 1").pluck(:list_id)
  # }

  # scope :non_shared_list_ids, -> {
  #   group(:list_id).having("COUNT(list_id) = 1").pluck(:list_id)
  # }
end
