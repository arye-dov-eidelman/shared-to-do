class Lists::IndexSerializer < ListSerializer
  attributes :id, :name, :ownerName
  attribute :"shared?", key: "isShared"
end
