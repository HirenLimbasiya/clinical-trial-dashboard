/**
 * Officials Page
 * Professional officials listing with pagination
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Building,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
    dispatch(fetchOfficials({ page: currentPage, limit: 12 }));
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
            dispatch(fetchOfficials({ page: currentPage, limit: 12 }))
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
              <span className="stat-label">Total</span>
              <span className="stat-value">{pagination.totalItems}</span>
            </div>
          </div>
        )}
      </div>

      {/* Officials Grid */}
      {loading && currentPage === 1 ? (
        <div className="loading-container">
          <Loader message="Loading officials..." />
        </div>
      ) : (
        <>
          <div className="officials-grid">
            {officials.map((official, index) => (
              <div key={index} className="official-card">
                <div className="card-header">
                  <div className="official-avatar">
                    <User size={20} />
                  </div>
                  <div className="official-info">
                    <h3 className="official-name">{official.name}</h3>
                    <span className="trial-count">
                      {official.trialCount}{" "}
                      {official.trialCount === 1 ? "Trial" : "Trials"}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  {official.affiliations &&
                    official.affiliations.length > 0 && (
                      <div className="info-section">
                        <div className="section-header">
                          <Building size={16} />
                          <span>Affiliations</span>
                        </div>
                        <div className="tags-list">
                          {official.affiliations.map((aff, i) => (
                            <span key={i} className="tag tag-affiliation">
                              {aff}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {official.roles && official.roles.length > 0 && (
                    <div className="info-section">
                      <div className="section-header">
                        <Briefcase size={16} />
                        <span>Roles</span>
                      </div>
                      <div className="tags-list">
                        {official.roles.map((role, i) => (
                          <span key={i} className="tag tag-role">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!official.affiliations?.length &&
                    !official.roles?.length && (
                      <p className="no-info">
                        No additional information available
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages} •
                {pagination.totalItems} total officials
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
