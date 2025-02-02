import { AutoComplete, Spin } from "antd";
import { useState } from "react";
import { fetchAirports } from "./apifunction";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";

const SearchAirport = ({ onSelect, placeholder }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleSearch = debounce(async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetchAirports(query);
      setData(response);
      setLoading(false);
      console.log(response);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, 800);

  return (
    <AutoComplete
      showSearch
      placeholder={placeholder}
      notFoundContent={loading ? <Spin size="small" /> : "No results"}
      onSearch={handleSearch}
      onSelect={onSelect}
      style={{ width: "100%", marginBottom: 10 }}
      options={(data || []).map((d) => ({
        value: d.value,
        label: d.label,
      }))}
    />
  );
};

SearchAirport.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SearchAirport;
