class Item < ApplicationRecord
  belongs_to :list

  validates :name, presence: true, length: { in: 1..500 }
  validates :list, presence: true

  scope :complete, -> { where(checked: true)}
  scope :incomplete, -> { where(checked: false)}
end
