class List < ApplicationRecord
  has_many :items
  has_many :lists_users, dependent: :destroy
  has_many :users, through: :lists_users
  validates :name, presence: true, length: { in: 1..100 }

  def items_attributes=(items_attributes)
    self.items.destroy_all
    items_attributes.each do |i, item_attributes|
      if item_attributes[:name].present?
        self.items.build(item_attributes)
      end
    end
  end

  scope :owned_by, ->(user) { where(id: ListsUser.where(user: user).is_owner) }
  scope :not_owned_by, ->(user) { where(id: ListsUser.where(user: user).is_not_owner) }
end
