Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "lists#index"
  resources :lists do
    resources :users, controller: 'lists/users', only: [:new, :create, :index, :destroy]
  end
  resources :users
  resource :sessions, only: [:new, :create, :destroy]
  get '/auth/facebook/callback' => 'sessions#create'

end
