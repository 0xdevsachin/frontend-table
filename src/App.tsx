import { useEffect, useState } from 'react';
import Loading from './components/loading';
import './App.css';

type ITableType = {
  "s.no": number,
  "amt.pledged": number,
  "percentage.funded": number,
}

const Table = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<ITableType[]>([])
  const [loading, setLoading] = useState(false)
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const fetchTableData = async () => {
    try {
      setLoading(true)
      const res = await fetch("https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json")
      const response = await res.json();
      setTableData(response)
    } catch (error) {
      console.log(">>> error", error)
    } finally {
      setLoading(false)
    }
  }

  const getPageNumbers = () => {
    const SHOW_FIRST = 1;
    const SHOW_LAST = totalPages;
    const SHOW_AROUND_CURRENT = 2;

    let pageNumbers = [];

    for (let i = currentPage - SHOW_AROUND_CURRENT; i <= currentPage + SHOW_AROUND_CURRENT; i++) {
      if (i >= SHOW_FIRST && i <= SHOW_LAST) {
        pageNumbers.push(i);
      }
    }

    if (!pageNumbers.includes(SHOW_FIRST)) {
      pageNumbers = [SHOW_FIRST, ...pageNumbers];
    }
    if (!pageNumbers.includes(SHOW_LAST)) {
      pageNumbers = [...pageNumbers, SHOW_LAST];
    }

    const pagesWithDots = [];
    for (let i = 0; i < pageNumbers.length; i++) {
      pagesWithDots.push(pageNumbers[i]);

      if (pageNumbers[i + 1] && pageNumbers[i + 1] - pageNumbers[i] > 1) {
        pagesWithDots.push('...');
      }
    }

    return pagesWithDots;
  };

  useEffect(() => {
    fetchTableData()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Project Funding Table</h2>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>S No</th>
            <th>Amount Pledged</th>
            <th>Percentage Funded</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item['s.no']}>
              <td>{item['s.no']}</td>
              <td>{item['amt.pledged']}</td>
              <td>{item['percentage.funded']}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <div className="page-numbers">
          {getPageNumbers().map((item, idx) => (
            item === "..." ? (
              <span className='table-dots' key={idx}>{item}</span>
            ) : (
              <button
                key={idx}
                onClick={() => setCurrentPage(Number(item))}
                className={`page-number ${currentPage === item ? 'active' : ''}`}
              >
                {item}
              </button>
            )
          ))}
        </div>

        <button
          className="pagination-button"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;