class AddPreviewAttrs < ActiveRecord::Migration[8.0]
  def change
    create_enum :status, [ :pending, :complete, :error ]
    add_column :previews, :status, "status", null: false, default: :pending
    add_column :previews, :raw_url, :string
    add_column :previews, :image_url, :string
  end
end
