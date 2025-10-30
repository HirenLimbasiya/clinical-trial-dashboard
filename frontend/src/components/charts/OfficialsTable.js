import React from "react";

const OfficialsTable = ({ data, pagination, onPageChange, loading }) => {
  if (!data || data.length === 0) {
    return <div className="no-data">No officials data available</div>;
  }

  const handlePrevPage = () => {
    if (pagination?.hasPrevPage) {
      onPageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      onPageChange(pagination.currentPage + 1);
    }
  };

  return (
    <div className="officials-container">
      <div className="table-wrapper">
        <table className="officials-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Affiliations</th>
              <th>Roles</th>
              <th>Trial Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((official, index) => (
              <tr key={index}>
                <td className="official-name">{official.name}</td>
                <td>
                  {official.affiliations && official.affiliations.length > 0 ? (
                    <div className="affiliations-list">
                      {official.affiliations.map((aff, i) => (
                        <span key={i} className="affiliation-badge">
                          {aff}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td>
                  {official.roles && official.roles.length > 0 ? (
                    <div className="roles-list">
                      {official.roles.map((role, i) => (
                        <span key={i} className="role-badge">
                          {role}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td className="trial-count">{official.trialCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing page {pagination.currentPage} of {pagination.totalPages} (
            {pagination.totalItems} total officials)
          </div>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              onClick={handlePrevPage}
              disabled={!pagination.hasPrevPage || loading}
            >
              ← Previous
            </button>
            <span className="page-indicator">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage || loading}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialsTable;
