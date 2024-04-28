export interface FlightData {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string | null;
    timezone: string | null;
    iata: string | null;
    icao: string | null;
    terminal: string | null;
    gate: string | null;
    delay: number | null;
    scheduled: string | null;
    estimated: string | null;
    actual: string | null;
    estimated_runway: string | null;
    actual_runway: string | null;
  };
  arrival: {
    airport: string | null;
    timezone: string | null;
    iata: string | null;
    icao: string | null;
    terminal: string | null;
    gate: string | null;
    baggage: string | null;
    delay: number | null;
    scheduled: string | null;
    estimated: string | null;
    actual: string | null;
    estimated_runway: string | null;
    actual_runway: string | null;
  };
  airline: {
    name: string | null;
    iata: string | null;
    icao: string | null;
  };
  flight: {
    number: string | null;
    iata: string | null;
    icao: string | null;
    codeshared: {
      airline_name: string | null;
      airline_iata: string | null;
      airline_icao: string | null;
      flight_number: string | null;
      flight_iata: string | null;
      flight_icao: string | null;
    } | null;
  };
  aircraft: any;
  live: any;
}

export type FlightsResponse = Array<FlightData>;
