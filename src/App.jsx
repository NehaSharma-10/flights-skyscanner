import { useMemo, useState } from "react";
import {
  DatePicker,
  Button,
  Spin,
  Flex,
  Dropdown,
  InputNumber,
  Select,
} from "antd";
import dayjs from "dayjs";
import SearchAirport from "./SearchAirport";
import { fetchFlightsApi } from "./apifunction";
import FLightsList from "./FLightsList";
import { UserOutlined } from "@ant-design/icons";

const App = () => {
  const [oneway, setOneway] = useState(true);
  const [showAdult, setShowAdult] = useState(false);

  const [adultCount, setAdultCount] = useState({
    adults: 0,
    childrens: 0,
    infants: 0,
  });
  const items = useMemo(() => {
    return [
      {
        key: "1",
        label: (
          <Flex justify="space-between" align="center">
            <p>Adult</p>
            <InputNumber
              min={0}
              value={adultCount.adults}
              onChange={(value) =>
                setAdultCount({ ...adultCount, adults: value })
              }
              size="small"
              onClick={(e) => e.stopPropagation()}
            />
          </Flex>
        ),
      },
      {
        key: "2",
        label: (
          <Flex justify="space-between" align="center">
            <p>Childrens</p>
            <InputNumber
              min={0}
              value={adultCount.childrens}
              onChange={(value) =>
                setAdultCount({ ...adultCount, childrens: value })
              }
              onClick={(e) => e.stopPropagation()}
            />
          </Flex>
        ),
      },
      {
        key: "3",
        label: (
          <Flex justify="space-between" align="center">
            <p>Infants</p>
            <InputNumber
              min={0}
              value={adultCount.infants}
              onChange={(value) =>
                setAdultCount({ ...adultCount, infants: value })
              }
              onClick={(e) => e.stopPropagation()}
            />
          </Flex>
        ),
      },
    ];
  }, [adultCount]);

  const [origin, setOrigin] = useState({
    originSkyId: "",
    originEntityId: "",
  });
  const [destination, setDestination] = useState({
    destinationSkyId: "",
    destinationEntityId: "",
  });

  const [filters, setFilters] = useState({
    date: null,
    returnDate: null,
    cabinClass: "economy",
    sortBy: "best",
  });
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);
  const [originAirports, setOriginAirports] = useState({
    data: [],
    loading: false,
  });
  const [destinationAirports, setDestinationAirports] = useState({
    data: [],
    loading: false,
  });

  const fetchFlights = async () => {
    if (!origin || !destination || !filters.date) {
      setError("Please fill all fields.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetchFlightsApi({
        ...origin,
        ...destination,
        ...filters,

        date: dayjs(filters.date).format("YYYY-MM-DD"),
        ...(filters.returnDate && {
          returnDate: dayjs(filters.returnDate).format("YYYY-MM-DD"),
        }),
        ...Object.fromEntries(
          Object.entries(adultCount).filter(([, value]) => value > 0)
        ),
      });
      console.log(response);

      setFlights(response || []);
    } catch (e) {
      console.log(e);

      setError("Failed to fetch flights. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {error && <p>{error}</p>}

      <Flex gap={20}>
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
          open={showAdult}
        >
          <Button
            icon={<UserOutlined />}
            onClick={() => setShowAdult(!showAdult)}
          >
            {adultCount && Object.values(adultCount).reduce((a, b) => a + b)}
          </Button>
        </Dropdown>

        <Select
          onChange={(value) => setOneway(value === "oneway")}
          placeholder="Trip"
          defaultValue="oneway"
          style={{
            width: 120,
          }}
          options={[
            {
              value: "oneway",
              label: "One Way",
            },
            {
              value: "round_trip",
              label: "Round Trip",
            },
          ]}
        />
        <Select
          placeholder="Select Cabin Class"
          defaultValue="economy"
          onChange={(e) => setFilters({ ...filters, cabinClass: e })}
          style={{
            width: 120,
          }}
          options={[
            {
              value: "economy",
              label: "Economy",
            },
            {
              value: "premium_economy",
              label: "Premium Economy",
            },
            {
              value: "business",
              label: "Business",
            },
            {
              value: "first",
              label: "First",
            },
          ]}
        />
        <Select
          placeholder="Filter By"
          defaultValue="best"
          onChange={(e) => setFilters({ ...filters, sortBy: e })}
          style={{
            width: 120,
          }}
          options={[
            {
              value: "best",
              label: "Best",
            },
            {
              value: "price_high",
              label: "Price High",
            },
            {
              value: "fastest",
              label: "Fastest",
            },
            {
              value: "outbound_take_off_time",
              label: "Outbound take off time",
            },
            {
              value: "outbound_landing_time",
              label: "Outbound landing time",
            },
          ]}
        />
      </Flex>
      <Flex style={{ marginTop: 20 }} gap={10}>
        <SearchAirport
          onSelect={(dest) => {
            console.log(dest);

            const [entityId, skyId] = dest.split("-");
            setOrigin({ originSkyId: skyId, originEntityId: entityId });
          }}
          setSearch={setOriginAirports}
          options={(originAirports.data || []).map((airport) => ({
            value: airport.value,
            label: airport.label,
          }))}
          placeholder={"Origin"}
          loading={originAirports.loading}
        />

        <SearchAirport
          setSearch={setDestinationAirports}
          onSelect={(dest) => {
            const [entityId, skyId] = dest.split("-");
            setDestination({
              destinationSkyId: skyId,
              destinationEntityId: entityId,
            });
          }}
          options={(destinationAirports.data || []).map((airport) => ({
            value: airport.value,
            label: airport.label,
          }))}
          loading={destination.loading}
          placeholder={"Destination"}
        />

        <DatePicker
          placeholder="Select Date"
          onChange={(date) => setFilters({ ...filters, date: date })}
          style={{ width: "100%", marginBottom: 10 }}
        />
        {!oneway && (
          <DatePicker
            placeholder="Return Date"
            onChange={(date) => setFilters({ ...filters, returnDate: date })}
            style={{ width: "100%", marginBottom: 10 }}
          />
        )}
        <Button type="primary" block onClick={fetchFlights} disabled={loading}>
          {loading ? <Spin /> : "Search Flights"}
        </Button>
        <Button
          type="text"
          variant="solid"
          color="red"
          onClick={() => setFlights([])}
          title="Clear Flights"
        >
          Clear Flights
        </Button>
      </Flex>

      <FLightsList flightData={flights || []} loading={loading} />
    </div>
  );
};

export default App;
