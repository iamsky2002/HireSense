import { useState, useEffect } from "react";
import { TextInput, NumberInput, TagsInput, Button, FileButton } from "@mantine/core";
import { IconFileCv } from "@tabler/icons-react";
import { getMyProfile, updateProfile, uploadResume } from "../api/profile";

const MyProfilePage = () => {
  const [headline, setHeadline] = useState("");
  const [experienceYears, setExperienceYears] = useState<number | string>("");
  const [expectedCtc, setExpectedCtc] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // load the profile from the backend
  useEffect(() => {
    let active = true;
    getMyProfile()
      .then((p) => {
        if (!active) return;
        setHeadline(p.headline || "");
        setExperienceYears(p.experienceYears ?? "");
        setExpectedCtc(p.expectedCtc || "");
        setSkills(p.skills || []);
        setResumeUrl(p.resumeUrl);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const save = async () => {
    setMsg(null);
    setSaving(true);
    try {
      await updateProfile({
        headline: headline.trim() || undefined,
        experienceYears: experienceYears === "" ? undefined : Number(experienceYears),
        expectedCtc: expectedCtc.trim() || undefined,
        skills,
      });
      setMsg({ ok: true, text: "Profile saved!" });
    } catch {
      setMsg({ ok: false, text: "Couldn't save profile." });
    } finally {
      setSaving(false);
    }
  };

  const onResume = async (file: File | null) => {
    if (!file) return;
    setMsg(null);
    setUploading(true);
    try {
      const p = await uploadResume(file);
      setResumeUrl(p.resumeUrl);
      setMsg({ ok: true, text: "Resume uploaded!" });
    } catch (err) {
      const status = (err as any)?.response?.status;
      setMsg({
        ok: false,
        text: status === 400 ? "Only PDF resumes are allowed." : "Couldn't upload resume.",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center text-mine-shaft-300">Loading profile...</div>;
  }

  return (
    <div className="p-4 md:p-8 min-h-[90vh] max-w-2xl">
      <div className="text-2xl font-semibold text-mine-shaft-100 mb-6">My Profile</div>

      <div className="flex flex-col gap-4">
        <TextInput
          label="Headline"
          placeholder="e.g. Java Backend Developer"
          value={headline}
          onChange={(e) => setHeadline(e.currentTarget.value)}
        />
        <NumberInput
          label="Experience (years)"
          placeholder="e.g. 2"
          min={0}
          value={experienceYears}
          onChange={setExperienceYears}
        />
        <TextInput
          label="Expected CTC"
          placeholder="e.g. 8-12 LPA"
          value={expectedCtc}
          onChange={(e) => setExpectedCtc(e.currentTarget.value)}
        />
        <TagsInput
          label="Skills"
          placeholder="Add skills"
          value={skills}
          onChange={setSkills}
          clearable
        />

        <Button color="bright-sun.4" className="w-fit" onClick={save} loading={saving}>
          Save Profile
        </Button>

        {/* Resume upload */}
        <div className="mt-4 border-t border-mine-shaft-800 pt-4 flex flex-col gap-2">
          <div className="text-mine-shaft-100 font-medium">Resume</div>
          <div className="flex items-center gap-3 flex-wrap">
            <FileButton onChange={onResume} accept="application/pdf">
              {(props) => (
                <Button
                  {...props}
                  variant="outline"
                  color="bright-sun.4"
                  leftSection={<IconFileCv size={18} />}
                  loading={uploading}
                >
                  Upload Resume (PDF)
                </Button>
              )}
            </FileButton>
            {resumeUrl && <span className="text-green-400 text-sm">Resume uploaded ✓</span>}
          </div>
        </div>

        {msg && (
          <div className={`text-sm ${msg.ok ? "text-green-400" : "text-red-400"}`}>{msg.text}</div>
        )}
      </div>
    </div>
  );
};

export default MyProfilePage;
