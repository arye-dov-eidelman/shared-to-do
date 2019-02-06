# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

developer_user = User.create(name: "arye", email: "aryedov.e@gmail.com", password: "password")
shopping_list = List.create(name: "Shopping List")
apple_item = Item.create(name: "Apples", list: shopping_list)
orange_item = Item.create(name: "Oranges", list: shopping_list)
grape_item = Item.create(name: "Grapes", list: shopping_list)
