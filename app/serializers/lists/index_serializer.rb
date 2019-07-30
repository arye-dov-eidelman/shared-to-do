class Lists::IndexSerializer < ListSerializer
  attributes :id, :name, :ownerName
  attribute :"shared?", key: "isShared"
  attribute :"updated_at", key: "updatedAt"
end
