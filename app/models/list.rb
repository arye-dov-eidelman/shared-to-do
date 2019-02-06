class List < ApplicationRecord
  has_many :items
  has_many :lists_users
  has_many :users, through: :lists_users
  validates :name, presence: true, length: { in: 1..100 }
end
