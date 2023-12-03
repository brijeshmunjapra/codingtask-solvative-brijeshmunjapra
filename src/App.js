import { useEffect, useRef, useState } from "react";
import Table from "./components/Table";
import "./index.css";
import axios from "axios";

function App() {
  const [tableData, setTableData] = useState([]);
  const [inputdata, setInputData] = useState("");
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(5)
  const [url, setUrl] = useState("");
  const inputRef = useRef();

  const options = {
    method: "GET",
    url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities${url}`,
    params: {
      countryIds: "IN",
      namePrefix: "del",
      limit: dataPerPage,
      offset: (currentPage - 1) * 3,
    },
    headers: {
      "X-RapidAPI-Key": "da53145335mshf712b1766d7716ep1e4c5ejsn2cbde9143cd7",
      "X-RapidAPI-Host": process.env.REACT_APP_APIHOST,
    },
  };
  const fetchData = async () => {
    try {
      const response = await axios.request(options);
      setTableData(response?.data);
      setLinks(response?.data?.links);
      setTotalPage(response?.data?.metadata?.totalCount / 3);
      console.log(response?.data, "responce");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();

    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        inputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, dataPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let temp = tableData?.data;

    temp = temp.filter((result) => {
      const nameMatch = result.name
        .toLowerCase()
        .includes(inputdata.toLowerCase());
      const countryMatch = result.country
        .toLowerCase()
        .includes(inputdata.toLowerCase());
      return nameMatch || countryMatch;
    });

    setTableData((prevData) => ({
      ...prevData,
      data: temp,
    }));
    setIsFilterApplied(true);
  };

  const handleRemoveFilter = () => {
    setIsFilterApplied(false);
    fetchData();
    setInputData("");
  };

  return (
    <div className="App">
      <div className="search-container">
        <form onSubmit={(e) => handleSearch(e)} className="search-form">
          <input
            className="search-input"
            type="text"
            placeholder="Search places..."
            value={inputdata}
            ref={inputRef}
            onChange={(e) => setInputData(e.target.value)}
          />

          <div className="search-shortcut">Ctrl+/</div>
        </form>
        
      </div>
      {isFilterApplied && tableData?.data?.length !== 3 && (
          <button className="remove-filter" onClick={handleRemoveFilter}>Remove Filter</button>
        )}
      <div className="table-container">
        <Table
          tableData={tableData}
          links={links}
          setUrl={setUrl}
          handlePageChange={handlePageChange}
          currentPage={currentPage}
          totalPage={totalPage}
          dataPerPage={dataPerPage}
          setDataPerPage= {setDataPerPage}
        />
      </div>
    </div>
  );
}

export default App;
