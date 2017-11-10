class CreateRoutes < ActiveRecord::Migration
  def change
    create_table :routes do |t|
      t.string :start
      t.string :goal

      t.timestamps null: false
    end
  end
end
