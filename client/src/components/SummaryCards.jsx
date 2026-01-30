const SummaryCards = ({ stats, totalProcessed, statusFilter, setPage }) => {
  const getCount = (status) => stats?.find((s) => s._id === status)?.count || 0;

  const cards = [
    {
      title: "Total Processed",
      value: totalProcessed,
      status: "ALL",
      color: "text-blue-800",
      border: "border-blue-300",
    },
    {
      title: "Matched",
      value: getCount("MATCHED"),
      status: "MATCHED",
      color: "text-green-800",
      border: "border-green-300",
    },
    {
      title: "Mismatches",
      value: getCount("UNMATCHED"),
      status: "UNMATCHED",
      color: "text-red-800",
      border: "border-red-300",
    },
    {
      title: "Duplicates",
      value: getCount("DUPLICATE"),
      status: "DUPLICATE",
      color: "text-gray-800",
      border: "border-gray-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          onClick={() => {
            // Only trigger if props function exists
            if (statusFilter) statusFilter(card.filterId);
            if (setPage) setPage(1);
          }}
          className={`bg-white border-l-4 ${card.border} p-4 rounded shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-center`}
        >
          <p
            className={`${card.color} text-xs uppercase font-bold opacity-80 mb-1`}
          >
            {card.title}
          </p>
          <p className="text-2xl font-bold text-gray-800">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
