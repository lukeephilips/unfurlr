class FetchImagePreviewJob < ApplicationJob
  queue_as :default

  def initialize(url)
    @url = url
    @preview = Preview.find_by(raw_url: @url)
    self.perform
  end

  def perform
    p "running job #{@url}"
    
    response = fetch_response
    if !response
      puts "no response"
      handle_error
      return
    end

    image_url = find_image(response.body)

    if image_url
      p "found #{image_url}"
      @preview.image_url = image_url
      @preview.status = :complete
    end

    @preview.save
  end

  def fetch_response
    begin
      resp = Faraday.new(url: @url) do |faraday|
        faraday.response :follow_redirects # use Faraday::FollowRedirects::Middleware
        faraday.adapter Faraday.default_adapter
      end
      .get
    rescue => e
      @preview.update({status: :error})
      puts "error #{e}"
    end


  end

  def find_image(body)
    pattern = /<meta\s+property="og:image"\s+content="([^"]+)"\s*\/?>/
    match = body.match(pattern)
    if match
      return CGI.unescape(match[1])
    end
    return handle_error
  end

  def handle_error
    @preview.status = :error
  end
end
