// src/pages/Admin/PendingApprovals.jsx
import AirdropsList from './AirdropsList';

const PendingApprovals = () => {
  return (
    <AirdropsList 
      defaultFilters={{ status: 'pending', sort: 'newest' }}
      title="Pending Approvals"
    />
  );
};

export default PendingApprovals;