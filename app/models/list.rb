class List < ApplicationRecord
  has_many :items
  has_many :lists_users, dependent: :destroy
  has_many :users, through: :lists_users
  validates :name, presence: true, length: { in: 1..100 }
  
  # accepts_nested_attributes_for :items

  def items_attributes=(items_attributes)
    self.items.destroy_all
    items_attributes.each do |i, item_attributes|
      if item_attributes[:name].present?
        self.items.build(item_attributes)
      end
    end
  end
end
