class User < ApplicationRecord
  has_secure_password
  has_many :owned_lists, class_name: "List", foreign_key: "owner_id"
  has_many :lists_users, dependent: :destroy
  has_many :lists, through: :lists_users, source: :list #, class_name: "List"#, foreign_key: "list_id"

  validates :name, :email, :password, presence: true

  validates :name, length: { in: 1..50 }
  validates :email, format: { with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/, message: "is an invalid address" }
  validates :email, uniqueness: true

  def email_and_name 
    "#{name} (#{email})"
  end
end
