class PreviewsController < ApplicationController
  def show
    render json: { ok: 'yay' } 
  end
end
