defmodule FlightguessrElixir.Repo do
  use Ecto.Repo,
    otp_app: :flightguessr_elixir,
    adapter: Ecto.Adapters.Postgres
end
