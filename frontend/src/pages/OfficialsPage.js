import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  fetchOfficials,
  selectOfficials,
} from "../redux/slices/analyticsSlice";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import "../styles/OfficialsPage.css";

const OfficialsPage = () => {
  const dispatch = useDispatch();
  const {
    data: officials,
    pagination,
    loading,
    error,
  } = useSelector(selectOfficials);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchOfficials({ page: currentPage, limit: 15 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="officials-page">
        <div className="page-header">
          <h1 className="page-title">Officials</h1>
          <p className="page-subtitle">
            Research leaders and principal investigators
          </p>
        </div>
        <ErrorMessage
          message={error}
          onRetry={() =>
            dispatch(fetchOfficials({ page: currentPage, limit: 15 }))
          }
        />
      </div>
    );
  }

  return (
    <div className="officials-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Officials</h1>
          <p className="page-subtitle">
            Research leaders and principal investigators
          </p>
        </div>
        {pagination && (
          <div className="header-stats">
            <div className="stat-badge">
              <span className="stat-label">Total Officials</span>
              <span className="stat-value">{pagination.totalItems}</span>
            </div>
          </div>
        )}
      </div>

      {/* Officials Table */}
      {loading && currentPage === 1 ? (
        <div className="loading-container">
          <Loader message="Loading officials..." />
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="officials-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Affiliations</th>
                  <th>Roles</th>
                  <th className="text-center">Trials</th>
                </tr>
              </thead>
              <tbody>
                {officials.map((official, index) => (
                  <tr key={index}>
                    <td>
                      <div className="official-name">{official.name}</div>
                    </td>
                    <td>
                      {official.affiliations &&
                      official.affiliations.length > 0 ? (
                        <div className="tags-cell">
                          {official.affiliations.map((aff, i) => (
                            <span key={i} className="tag tag-affiliation">
                              {aff}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {official.roles && official.roles.length > 0 ? (
                        <div className="tags-cell">
                          {official.roles.map((role, i) => (
                            <span key={i} className="tag tag-role">
                              {role}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="text-center">
                      <span className="trial-count">{official.trialCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(currentPage - 1) * pagination.itemsPerPage + 1} -{" "}
                {Math.min(
                  currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}{" "}
                of {pagination.totalItems} officials
              </div>

              <div className="pagination-controls">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage || loading}
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <div className="page-numbers">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        pagination.currentPage >=
                        pagination.totalPages - 2
                      ) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          className={`page-number ${
                            pageNum === pagination.currentPage ? "active" : ""
                          }`}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage || loading}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OfficialsPage;
