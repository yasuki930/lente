json.extract! route, :id, :start, :goal, :created_at, :updated_at
json.url route_url(route, format: :json)
