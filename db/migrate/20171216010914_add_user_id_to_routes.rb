class AddUserIdToRoutes < ActiveRecord::Migration
  def change
    add_reference :routes, :user, index: true, foreign_key: true
  end
end
