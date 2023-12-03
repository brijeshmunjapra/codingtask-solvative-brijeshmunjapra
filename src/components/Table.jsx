import React from "react";

const Table = ({ tableData }) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Place Name</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {tableData?.data?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td className="country-name">
                <img
                  src={`https://flagsapi.com/${item.countryCode}/shiny/64.png`}
                  alt={item.countryCode}
                />
                {item.country}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button>Prev</button>
        <button>Next</button>
      </div>
    </>
  );
};

export default Table;
