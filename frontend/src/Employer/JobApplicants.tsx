import { useState } from "react";
import { Button, Select, Modal, Textarea } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconClockHour3, IconMapPin, IconUsers, IconExternalLink, IconPencil, IconSparkles } from "@tabler/icons-react";
import { JobResponse } from "../api/jobs";
import {
  ApplicantResponse,
  ApplicationStatus,
  STATUS_FLOW,
  statusLabel,
  updateApplicationStatus,
} from "../api/applications";
import { jobTypeLabel, daysAgo } from "../FindJobs/jobMappers";
import { getCandidateMatches } from "../api/matches";
import { CandidateSummaryResponse } from "../api/candidates";

// all stages + REJECTED in Select's {value,label} format
const statusOptions = [...STATUS_FLOW, "REJECTED" as ApplicationStatus].map((s) => ({
  value: s,
  label: statusLabel[s],
}));

const JobApplicants = ({
  job,
  applicants,
  onStatusChange,
}: {
  job: JobResponse;
  applicants: ApplicantResponse[];
  onStatusChange: (applicationId: number, status: ApplicationStatus) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  // rejecting asks for a reason first, so we track the modal here
  const [reject, setReject] = useState<{ id: number; name: string } | null>(null);
  const [reason, setReason] = useState("");
  // AI candidate matches, loaded only when the employer opens the section
  const [matchOpen, setMatchOpen] = useState(false);
  const [matches, setMatches] = useState<CandidateSummaryResponse[] | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  const toggleMatches = async () => {
    const next = !matchOpen;
    setMatchOpen(next);
    if (next && matches === null) {
      setMatchLoading(true);
      try {
        setMatches(await getCandidateMatches(job.id));
      } catch {
        setMatches([]);
      } finally {
        setMatchLoading(false);
      }
    }
  };

  const applyStatus = async (applicationId: number, status: ApplicationStatus, why?: string) => {
    setError("");
    try {
      await updateApplicationStatus(applicationId, status, why);
      onStatusChange(applicationId, status); // tell the parent so the stats stay in sync
    } catch {
      setError("Couldn't update status, please try again.");
    }
  };

  const onSelect = (a: ApplicantResponse, val: ApplicationStatus) => {
    if (val === "REJECTED") {
      setReason("");
      setReject({ id: a.applicationId, name: a.candidateName });
    } else {
      applyStatus(a.applicationId, val);
    }
  };

  const confirmReject = async () => {
    if (!reject) return;
    await applyStatus(reject.id, "REJECTED", reason.trim());
    setReject(null);
  };

  return (
    <div className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-xl p-4 w-full flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold text-mine-shaft-100">{job.title}</div>
        <span className="text-xs text-mine-shaft-400 shrink-0">
          {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-mine-shaft-400">
        {job.location && (
          <span className="flex items-center gap-1">
            <IconMapPin size={14} /> {job.location}
          </span>
        )}
        {job.type && (
          <span className="flex items-center gap-1">
            <IconUsers size={14} /> {jobTypeLabel(job.type)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <IconClockHour3 size={14} /> {daysAgo(job.postedAt)}d ago
        </span>
      </div>

      <div className="flex gap-2 items-center">
        <Button
          size="xs"
          color="brightSun.4"
          variant="light"
          onClick={() => setOpen((o) => !o)}
          disabled={applicants.length === 0}
        >
          {applicants.length === 0 ? "No applicants yet" : open ? "Hide applicants" : "View applicants"}
        </Button>
        <Button
          size="xs"
          variant="subtle"
          color="brightSun.4"
          leftSection={<IconSparkles size={14} />}
          onClick={toggleMatches}
        >
          {matchOpen ? "Hide top matches" : "Top matches"}
        </Button>
        <Link to={`/edit-job/${job.id}`}>
          <Button size="xs" variant="subtle" color="brightSun.4" leftSection={<IconPencil size={14} />}>
            Edit job
          </Button>
        </Link>
      </div>

      {error && <div className="text-xs text-red-400">{error}</div>}

      {open && (
        <div className="mt-2 flex flex-col gap-2 border-t border-mine-shaft-800 pt-3">
          {applicants.map((a) => (
            <div
              key={a.applicationId}
              className="flex flex-wrap items-center justify-between gap-3 bg-mine-shaft-800 rounded-lg px-3 py-2"
            >
              <div>
                <div className="text-mine-shaft-100 text-sm font-medium">{a.candidateName}</div>
                <div className="text-mine-shaft-400 text-xs">
                  {a.candidateEmail} • applied {daysAgo(a.appliedAt)}d ago
                </div>
                <Link
                  to={`/talent-profile/${a.candidateId}`}
                  className="text-bright-sun-400 text-xs hover:underline inline-flex items-center gap-1 mt-1"
                >
                  View profile <IconExternalLink size={12} />
                </Link>
              </div>
              <Select
                size="xs"
                data={statusOptions}
                value={a.status}
                onChange={(val) => val && onSelect(a, val as ApplicationStatus)}
                allowDeselect={false}
                className="w-40"
              />
            </div>
          ))}
        </div>
      )}

      {matchOpen && (
        <div className="mt-2 flex flex-col gap-2 border-t border-mine-shaft-800 pt-3">
          <div className="text-xs text-mine-shaft-400">
            Candidates ranked by how closely their profile fits this role (AI).
          </div>
          {matchLoading ? (
            <div className="text-sm text-mine-shaft-400">Finding matches...</div>
          ) : !matches || matches.length === 0 ? (
            <div className="text-sm text-mine-shaft-400">
              No matches yet. Matching runs once candidate profiles are indexed.
            </div>
          ) : (
            matches.map((c) => (
              <div
                key={c.userId}
                className="flex flex-wrap items-center justify-between gap-3 bg-mine-shaft-800 rounded-lg px-3 py-2"
              >
                <div>
                  <div className="text-mine-shaft-100 text-sm font-medium">{c.fullName}</div>
                  <div className="text-mine-shaft-400 text-xs">
                    {c.headline || "No headline"}
                    {c.experienceYears != null && ` • ${c.experienceYears} yrs`}
                  </div>
                  {c.skills.length > 0 && (
                    <div className="text-mine-shaft-400 text-xs mt-0.5">{c.skills.join(", ")}</div>
                  )}
                </div>
                <Link
                  to={`/talent-profile/${c.userId}`}
                  className="text-bright-sun-400 text-xs hover:underline inline-flex items-center gap-1"
                >
                  View profile <IconExternalLink size={12} />
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      <Modal
        opened={!!reject}
        onClose={() => setReject(null)}
        title={reject ? `Reject ${reject.name}?` : "Reject applicant"}
        centered
      >
        <div className="flex flex-col gap-3">
          <Textarea
            label="Reason for rejection"
            description="The candidate will see this, so they know why."
            placeholder="e.g. Looking for more hands-on Spring Boot experience."
            value={reason}
            onChange={(e) => setReason(e.currentTarget.value)}
            autosize
            minRows={3}
          />
          <div className="flex justify-end gap-2">
            <Button variant="default" size="xs" onClick={() => setReject(null)}>
              Cancel
            </Button>
            <Button color="red" size="xs" disabled={!reason.trim()} onClick={confirmReject}>
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobApplicants;
