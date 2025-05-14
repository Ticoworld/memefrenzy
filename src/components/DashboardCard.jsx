import PropTypes from 'prop-types';

const DashboardCard = ({ title, count, action }) => (
  <div 
    className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
    onClick={action}
    role="button"
    tabIndex="0"
    aria-label={`View ${title}`}
  >
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-3xl font-bold text-purple-400">{count}</p>
  </div>
);

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  action: PropTypes.func.isRequired,
};

export default DashboardCard;