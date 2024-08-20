/* eslint-disable react/prop-types */
function Alert({ color, children }) {
    const colors = {
      success: 'bg-green-100 text-green-800',
      failure: 'bg-red-100 text-red-800',
     
    };
  
    return (
      <div className={`p-4 mb-4 border rounded-md ${colors[color]} border-${color}-300`}>
        {children}
      </div>
    );
  }
export default Alert   