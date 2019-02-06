class Item < ApplicationRecord
  belongs_to :list

  validates :name, presence: true, length: { in: 1..500 }
  validates :list, presence: true
end
