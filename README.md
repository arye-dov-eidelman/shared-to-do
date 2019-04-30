# Sharable To Do lists App

A Check list app where you can share access to Check lists with others

## Setup

```bash
# clone this repository
git clone git@github.com:arye-dov-eidelman/shared-to-do.git

# navigate into the directory
cd shared-to-do

# keep rvm calm
rvm install "ruby-2.3.8"
rvm use 2.3.8

# bundle gems
gem install bundler
bundle

# Setup the SQL database
rails db:create
rails db:migrate

# start the server
rails s
```
