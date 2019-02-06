class List < ApplicationRecord
  validates :name, presence: true, length: { in: 1..100 }
end
