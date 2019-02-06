class User < ApplicationRecord
  has_secure_password

  validates :name, :email, :password, presence: true

  validates :name, length: { in: 1..50 }
  validates :email, format: { with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/, message: "is an invalid address" }
  validates :email, uniqueness: true
end
