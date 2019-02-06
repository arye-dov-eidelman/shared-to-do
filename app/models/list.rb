class List < ApplicationRecord
  has_many :items
  validates :name, presence: true, length: { in: 1..100 }
end
