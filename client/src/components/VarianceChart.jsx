import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const VarianceChart = ({ stats }) => {
  const data = stats
    .filter(s => s._id !== 'MATCHED') 
    .map(item => ({
      name: item._id.replace('_', ' '), 
      amount: item.totalVariance || 0,
      color: item._id === 'MISMATCH' ? '#dc2626' : '#ca8a04' 
    }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col justify-center">
      <h3 className="text-lg font-bold text-gray-700 mb-2">Variance Impact ($)</h3>
      <p className="text-xs text-gray-400 mb-4">Total value difference by category</p>
      
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                tick={{fontSize: 10, fill: '#6b7280'}} 
            />
            <Tooltip 
                formatter={(val) => [`$${val.toFixed(2)}`, 'Variance']}
                cursor={{fill: '#f3f4f6'}}
            />
            <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VarianceChart;