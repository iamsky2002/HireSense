import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ApplicationResponse, STATUS_FLOW, statusLabel } from "../api/applications";
import { daysAgo } from "../FindJobs/jobMappers";

const TrackerRow = ({ app }: { app: ApplicationResponse }) => {
  const rejected = app.status === "REJECTED";
  // 1-based position on the happy path; 0 for rejected
  const level = rejected ? 0 : STATUS_FLOW.indexOf(app.status) + 1;

  return (
    <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            to={`/jobs/${app.jobId}`}
            className="font-semibold text-mine-shaft-100 hover:text-bright-sun-400 transition-colors"
          >
            {app.jobTitle}
          </Link>
          <div className="text-xs text-mine-shaft-400">
            {app.company} • applied {daysAgo(app.appliedAt)}d ago
          </div>
        </div>
        {rejected && (
          <span className="text-[11px] font-semibold text-red-400 bg-red-400/10 border border-red-400/30 px-2 py-1 rounded-lg shrink-0">
            Rejected
          </span>
        )}
      </div>

      {rejected ? (
        <div className="flex flex-col gap-1">
          <div className="text-xs text-red-400">
            Not selected{app.rejectedFromStage ? ` at the ${statusLabel[app.rejectedFromStage]} stage` : ""}.
          </div>
          {app.rejectionReason && (
            <div className="text-xs text-mine-shaft-400">Reason: {app.rejectionReason}</div>
          )}
        </div>
      ) : (
        // many stages, so scroll horizontally on small screens
        <div className="overflow-x-auto pb-1">
          <div className="min-w-[560px] px-1">
            <div className="flex items-center">
              {STATUS_FLOW.map((s, i) => (
                <Fragment key={s}>
                  <span
                    className={`h-3 w-3 rounded-full shrink-0 ${
                      level >= i + 1 ? "bg-bright-sun-400" : "bg-mine-shaft-700"
                    }`}
                  />
                  {i < STATUS_FLOW.length - 1 && (
                    <div
                      className={`h-[2px] flex-grow mx-1 ${
                        level >= i + 2 ? "bg-bright-sun-400" : "bg-mine-shaft-700"
                      }`}
                    />
                  )}
                </Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              {STATUS_FLOW.map((s, i) => (
                <span
                  key={s}
                  className={`text-[10px] whitespace-nowrap ${
                    level >= i + 1 ? "text-bright-sun-400" : "text-mine-shaft-500"
                  }`}
                >
                  {statusLabel[s]}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ApplicationTracker = ({ apps }: { apps: ApplicationResponse[] }) => {
  // latest 4, most recent first
  const recent = [...apps]
    .sort((a, b) => +new Date(b.appliedAt) - +new Date(a.appliedAt))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-mine-shaft-100">Application tracker</div>
        <Link to="/job-history" className="text-xs text-bright-sun-400 hover:underline">
          View all
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-6 text-center text-mine-shaft-400 text-sm">
          No applications yet.{" "}
          <Link to="/find-jobs" className="text-bright-sun-400 hover:underline">
            Browse jobs →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {recent.map((a) => (
            <TrackerRow key={a.applicationId} app={a} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
