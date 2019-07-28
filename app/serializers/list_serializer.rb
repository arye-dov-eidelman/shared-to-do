class ListSerializer < ActiveModel::Serializer
  attributes :id, :name

  def ownerName
    object.owner.name
  end
end
