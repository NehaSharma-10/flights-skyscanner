import { Table } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";

const FLightsList = ({ flightData, loading }) => {
  const defaultColumns = [
    {
      title: "No.",
      dataIndex: "flightno",
    },
    {
      title: "Name",
      dataIndex: "flightname",
    },
    {
      title: "Origin",
      dataIndex: "origin",
    },
    {
      title: "Destination",
      dataIndex: "destination",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Departure",
      dataIndex: "departure",
      render: (e) => dayjs(e).format("D MMM YYYY, hh:mm a"),
    },
    {
      title: "Arrival",
      dataIndex: "arrival",
      render: (e) => dayjs(e).format("D MMM YYYY, hh:mm a"),
    },
  ];

  return (
    <Table
      loading={loading}
      style={{ marginTop: 20 }}
      rowClassName={() => "editable-row"}
      bordered
      dataSource={flightData || []}
      columns={defaultColumns}
      locale={{
        emptyText: "No Flights Found",
      }}
    />
  );
};

FLightsList.propTypes = {
  flightData: PropTypes.arrayOf().isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FLightsList;
