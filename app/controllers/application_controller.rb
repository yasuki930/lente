class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  def after_sign_in_path_for(resource)
    route_search_index_path
  end
  
  def after_sign_out_path_for(resource)
    root_path
  end
end
