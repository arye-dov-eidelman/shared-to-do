Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :lists
  resources :users
  resource :sessions, only: [:new, :create, :destroy]
end
