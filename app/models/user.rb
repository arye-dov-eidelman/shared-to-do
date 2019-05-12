class User < ApplicationRecord
  has_secure_password
  has_many :lists, class_name: "List", foreign_key: "owner_id"
  has_many :lists_users, dependent: :destroy
  has_many :shared_lists, through: :lists_users

  validates :name, :email, :password, presence: true

  validates :name, length: { in: 1..50 }
  validates :email, format: { with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/, message: "is an invalid address" }
  validates :email, uniqueness: true

  # def owned_lists
  #   lists_users.where(is_owner: true).map(&:list).compact
  #   # lists.owned_by(self)
  # end

  # def not_owned_lists
  #   # lists.not_owned_by(self)
  #   # lists.where.not(id: List.owned_by(self.id))
  #   lists_users.where(is_owner: false).map(&:list).compact    
  # end

  def email_and_name 
    "#{name} (#{email})"
  end
end
