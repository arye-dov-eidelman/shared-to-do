# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

developer_user = User.create(name: "arye",   email: "aryedov.e@gmail.com", password: "password")
user_1 =         User.create(name: "user_1", email: "user_1@gmail.com",    password: "password")
user_2 =         User.create(name: "user_2", email: "user_2@gmail.com",    password: "password")

shopping_list = List.create(name: "Shopping List")

apple_item =  Item.create(name: "Apples",  list: shopping_list)
orange_item = Item.create(name: "Oranges", list: shopping_list)
grape_item =  Item.create(name: "Grapes",  list: shopping_list)

ListsUser.create(list: shopping_list, user: developer_user, is_owner: true)
ListsUser.create(list: shopping_list, user: user_1,         is_owner: false)
