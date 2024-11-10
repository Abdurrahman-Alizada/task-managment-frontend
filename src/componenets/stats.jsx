import React from "react";

const BACKGROUND_STYLES = [
  "bg-blue-100 border-blue-200",
  "bg-emerald-100 border-emerald-200",
  "bg-purple-100 border-purple-200",
  "bg-amber-100 border-amber-200",
  "bg-rose-100 border-rose-200"
];

const TEXT_STYLES = [
  "text-blue-800",
  "text-emerald-800",
  "text-purple-800",
  "text-amber-800",
  "text-rose-800"
];

const Stats = ({ data }) => {
  const statsWithTotal = data?.stats ? [
    ...data?.stats
  ] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-20">
      {statsWithTotal.map((item, index) => (
        <div
          key={index + item?.label}
          className={`p-6 rounded-lg border ${BACKGROUND_STYLES[index]} transition-all hover:scale-105`}
        >
          <div className="space-y-2">
            <h3 className={`font-medium ${TEXT_STYLES[index]}`}>
              {item?.label}
            </h3>
            <p className={`text-2xl font-semibold ${TEXT_STYLES[index]}`}>
              {item?.count?.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;