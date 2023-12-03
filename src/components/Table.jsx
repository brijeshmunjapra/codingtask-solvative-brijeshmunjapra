import React from "react";

const Table = ({ tableData, handlePageChange, currentPage, totalPage, dataPerPage, setDataPerPage }) => {
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
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 ? true : false}
        >
          Prev
        </button>
        <span className="page-no">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPage ? true : false}
        >
          Next
        </button>
        {'No of Rows '}
        <select
        id="numberSelect"
        value={dataPerPage}
        onChange={(e)=>setDataPerPage(e.target.value)}
      >
        {Array.from({ length: 6 }, (_, index) => (
          <option key={index} value={index + 5}>
            {index + 5}
          </option>
        ))}
      </select>
      </div>
    </>
  );
};

export default Table;
