class Lists::ShowSerializer < ListSerializer
  attributes :id, :name, :owner
  attribute :"shared?", key: "isShared"
  attribute :"updated_at", key: "updatedAt"
  has_many :items, serializer: ItemsSerializer
end
