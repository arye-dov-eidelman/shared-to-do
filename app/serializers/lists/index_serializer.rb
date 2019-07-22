class Lists::IndexSerializer < ListSerializer
  attributes :id, :name, :ownerName
  attribute :"shared?", key: "isShared"

  def ownerName
    object.owner.name
  end
end
