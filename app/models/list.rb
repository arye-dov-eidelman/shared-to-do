class List < ApplicationRecord
  has_many :items
  belongs_to :owner, class_name: "User", foreign_key: "owner_id"
  has_many :lists_users, dependent: :destroy
  has_many :users, through: :lists_users
  validates :name, presence: true, length: { in: 1..100 }

  accepts_nested_attributes_for :items

  before_validation :delete_empty_items

  def delete_empty_items
    items.each do |item|
      item.destroy if item.name.blank?
    end
  end

  scope :shared,     -> { where(id: ListsUser.shared_list_ids) }
  scope :non_shared, -> { where(id: ListsUser.non_shared_list_ids) }

  # scope :owned_by, ->(user) { where(owner: user}
  # scope :not_owned_by, ->(user) { where(id: ListsUser.where(user: user).is_not_owner) }
  

  # def accessible_by?(user)
  #   lists_users.exists?(user: user)
  # end

  # def list_owner
  #   lists_users.find_by(is_owner: true)
  # end

  # def owner
  #   list_owner.user
  # end

  # def owner=(user)
  #   # save if unpersisted to ensure that the list_user can be created with a valid list_id
  #   save unless persisted?

  #   ListsUser.transaction do
  #     # if i have an owner change them to a collaborator 
  #     list_owner&.update(is_owner: false)

  #     # find or build the new_list_owner
  #     new_list_owner = lists_users.find_by(user: user) || lists_users.build(user: user)

  #     # update (or create) the new_list_owner to be the owner
  #     new_list_owner.update(is_owner: true)
  #   end
  # end

  # def collaborators
  #   lists_users.is_not_owner.map(&:user)
  # end

  def share(options={})
    # options include
    # - with    - the person it's being shared with
    # - by      - the person sharing the list (defaults to list owner)
    # - message - a message to send to the person it's being shared with
    #
    # Example:
    # list.share(
    #   with: person_2,
    #   by: logged_in_user,
    #   message: "Here is a list of things to do before _____ trip. Pease you take care of ___ this week. Make sure to check it off when you're done."
    # )

    unless options[:with]
      return lists_users.build(user: nil, is_owner: false, share_message: options[:message])
    end

    options[:by] = owner unless options[:by]
    options[:message] = "#{options[:by].name} Shared #{name} list with you" unless options[:message]
    lists_user = lists_users.build(user: options[:with], is_owner: false, share_message: options[:message])
    lists_user.save
    lists_user
  end

  def shared?(options={})
    if options[:with]
      lists_users.exists?(user: options[:with])
    else
      lists_users.exists?
    end
  end

  def unshare_with(user)
    lists_users.find_by(user: user, is_owner: false).destroy
  end

  def unshare_all
    lists_users.where(is_owner: false).destroy_all
  end

  def share_message_for(user)
    lists_users.find_by(user: user).share_message
  end
end
