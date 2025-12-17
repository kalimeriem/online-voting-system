import React from "react";
import "./RecentActivity.css";

const RecentActivity = ({ activities }) => {
  // Map backend activity to UI-friendly format
  const mappedActivities = activities?.map(a => {
    let icon = "ℹ️";
    let color = "gray";

    // Choose icon/color based on action text
    const actionText = a.action?.toLowerCase() || "";
    if (actionText.includes("vote")) {
      icon = "✅";
      color = "green";
    } else if (actionText.includes("department")) {
      icon = "🏢";
      color = "blue";
    } else if (actionText.includes("election completed")) {
      icon = "🏆";
      color = "purple";
    }

    return {
      action: a.action,
      time: new Date(a.time).toLocaleString(),
      icon,
      color,
    };
  });

  return (
    <div className="section">
      <h2>Recent Activity</h2>
      <p className="subtitle">Your latest voting activities</p>

      {mappedActivities && mappedActivities.length > 0 ? (
        <div className="list">
          {mappedActivities.map((activity, index) => (
            <div key={index} className="activity">
              <div className={`icon ${activity.color || "gray"}`}>
                {activity.icon || "ℹ️"}
              </div>
              <div className="content">
                <p className="text">{activity.action}</p>
                <span className="time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">No recent activity to show.</p>
      )}
    </div>
  );
};

export default RecentActivity;
