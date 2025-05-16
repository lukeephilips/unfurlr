class PreviewsController < ApplicationController
  def show
    render json: { ok: "yay" }
  end

  def create
    url = params[:url]
    existing_preview = Preview.find_by(raw_url:url)
    if existing_preview
      return render json: {url: existing_preview.raw_url, status: existing_preview.status, preview_url: existing_preview.image_url}
    end
    
    new_preview = Preview.create({raw_url: url, status: :pending})

    FetchImagePreviewJob.new(url).perform
    render json: {url: new_preview.raw_url, status: new_preview.status, preview_url: new_preview.image_url}
  end
end
