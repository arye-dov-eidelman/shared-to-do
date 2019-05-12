# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

arye = User.create(name: "arye",   email: "aryedov.e@gmail.com", password: "password")
user_1 = User.create(name: "user_1", email: "user_1@gmail.com",    password: "password")
user_2 = User.create(name: "user_2", email: "user_2@gmail.com",    password: "password")

shopping_list = List.create(owner: arye, name: "Shopping")
to_do_list = List.create(owner: user_1, name: "To Do")
list_3 = List.create(owner: arye, name: "List 3")
list_4 = List.create(owner: arye, name: "List 4")
list_5 = List.create(owner: user_1, name: "List 5")
list_6 = List.create(owner: user_2, name: "List 6")

items =  Item.create([
  {name: "Apples",  list: shopping_list},
  {name: "Oranges", list: shopping_list},
  {name: "Grapes",  list: shopping_list},
  {name: "To Do, Item 1", list: to_do_list},
  {name: "To Do, Item 2", list: to_do_list},
  {name: "To Do, Item 3", list: to_do_list},
  {name: "List 3, Item 1", list: list_3},
  {name: "List 3, Item 2", list: list_3},
  {name: "List 3, Item 3", list: list_3}
])

shopping_list.share(with: user_1, message: "Here is the list of things you asked for")