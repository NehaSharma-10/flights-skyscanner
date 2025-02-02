import axios from "axios";

const getAirports =
  "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport";

const getFlights =
  "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights";

const headers = {
  "x-rapidapi-key": "0101711900msh5b6b09845567e66p10ae98jsn89fad0389c25",
  "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
};

export const fetchAirports = (query) => {
  return new Promise((resolve, reject) => {
    axios
      .get(getAirports, {
        params: { query },
        headers: headers,
      })
      .then((response) => {
        const data = response.data.data.map((airport) => ({
          value: `${airport.entityId}-${airport.navigation.relevantFlightParams.skyId}`,
          label: `${airport.navigation.localizedName}, ${airport.navigation.relevantFlightParams.skyId}, ${airport.presentation.subtitle}`,
        }));
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const fetchFlightsApi = (params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(getFlights, {
        params: params,
        headers: headers,
      })
      .then((response) => {
        const itineraries = response.data.data.itineraries || [];

        const flightData = itineraries.map((itinerary) => ({
          value: itinerary.id, // Use a unique identifier for each flight
          price: itinerary.price.formatted,
          duration: itinerary.legs[0].segments[0].durationInMinutes,
          arrival: itinerary.legs[0].segments[0].arrival,
          departure: itinerary.legs[0].segments[0].departure,
          flightname: itinerary.legs[0].segments[0].operatingCarrier.name,
          flightno: itinerary.legs[0].segments[0].flightNumber,
          origin: itinerary.legs[0].segments[0].origin.name,
          destination: itinerary.legs[0].segments[0].destination.name,
        }));

        console.log(flightData);

        resolve(flightData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
