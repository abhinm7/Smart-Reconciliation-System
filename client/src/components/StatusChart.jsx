import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatusChart = ({ stats }) => {
  const data = stats.map((item) => {
    let color = "#9ca3af";
    let name = item._id;

    if (item._id === "MATCHED") {
      color = "#16a34a";
      name = "Matched";
    }
    if (item._id === "MISMATCH") {
      color = "#dc2626";
      name = "Mismatch";
    }
    if (item._id === "PARTIAL_MATCH") {
      color = "#ca8a04";
      name = "Partial";
    }
    if (item._id === "DUPLICATE") {
      color = "#4b5563";
      name = "Duplicate";
    }

    return { name, value: item.count, color };
  });

  // Calculate Total for Center Label
  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  if (total === 0)
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No Data to Chart
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-full">
      <h3 className="text-lg font-bold text-gray-700 mb-4">
        Reconciliation Accuracy
      </h3>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} Records`, "Count"]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Accuracy Percentage Badge */}
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-500">Accuracy Score</span>
        <div className="text-2xl font-bold text-gray-800">
          {(
            ((data.find((d) => d.name === "Matched")?.value || 0) / total) *
            100
          ).toFixed(1)}
          %
        </div>
      </div>
    </div>
  );
};

export default StatusChart;
