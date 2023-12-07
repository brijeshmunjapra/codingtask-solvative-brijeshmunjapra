import { useEffect, useRef, useState } from "react";
import Table from "./components/Table";
import "./index.css";
import axios from "axios";

function App() {
  const [tableData, setTableData] = useState([]);
  const [inputdata, setInputData] = useState("");
  const [searchParams, setSearchParams] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(5)
  const inputRef = useRef();

  // Environment variable console to check -------------------------

  // console.log(process.env.REACT_APP_APIKEY, process.env.REACT_APP_APIHOST);

  const options = {
    method: "GET",
    url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities`,
    params: {
      countryIds: "IN",
      namePrefix: searchParams,
      limit: dataPerPage,
      offset: (currentPage - 1) * dataPerPage,
    },
    headers: {
      "X-RapidAPI-Key": process.env.REACT_APP_APIKEY ,
      "X-RapidAPI-Host": process.env.REACT_APP_APIHOST,
    },
  };
  const fetchData = async () => {
    try {
      const response = await axios.request(options);
      setTableData(response?.data);
      setTotalPage(response?.data?.metadata?.totalCount / dataPerPage);
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
  }, [currentPage, dataPerPage, searchParams]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleSearch = (e) => {
    e.preventDefault()
    setIsFilterApplied(true);
    setSearchParams(inputdata);
    setCurrentPage(1);
  };

  const handleRemoveFilter = () => {
    setIsFilterApplied(false);
    setInputData("");
    setSearchParams("")
    setCurrentPage(1);
  };

  return (
    <div className="App">
      <div className="search-container">
        <form onSubmit={(e)=>handleSearch(e)} className="search-form">
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
      {isFilterApplied && tableData?.data?.length !== dataPerPage && (
          <button className="remove-filter" onClick={handleRemoveFilter}>Remove Filter</button>
        )}
      <div className="table-container">
        <Table
          tableData={tableData}
          handlePageChange={handlePageChange}
          currentPage={currentPage}
          totalPage={totalPage}
          dataPerPage={dataPerPage}
          setDataPerPage= {setDataPerPage}
          setCurrentPage = {setCurrentPage}
        />
      </div>
    </div>
  );
}

export default App;
