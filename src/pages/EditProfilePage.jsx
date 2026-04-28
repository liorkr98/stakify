import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Save, Eye, Twitter, Globe, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MOCK_ANALYSTS, MOCK_REPORTS } from "@/lib/mockData";
import ReportCard from "@/components/feed/ReportCard";

const SPECIALTY_OPTIONS = ["AI & Semiconductors", "Big Tech", "EV & Clean Energy", "Macro", "Consumer Tech", "Financials", "Crypto & Web3", "Healthcare", "E-Commerce", "Options Flow"];

export default function EditProfilePage() {
  const navigate = useNavigate();
  const analyst = MOCK_ANALYSTS[0];
  const [tab, setTab] = useState("edit");
  const [name, setName] = useState(analyst.name);
  const [bio, setBio] = useState(analyst.bio || "");
  const [twitter, setTwitter] = useState("@sarahchen_finance");
  const [linkedin, setLinkedin] = useState("sarahchen");
  const [website, setWebsite] = useState("sarahchen.com");
  const [tagline, setTagline] = useState("Senior Equity Research Analyst · Tech & AI Specialist");
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([
    { id: 1, content: "Watching NVDA open. This AI infrastructure cycle has legs — don't fight the tape. 🟢", time: "2h ago" },
    { id: 2, content: "Fed commentary was more hawkish than expected. Rotating out of rate-sensitive names. Staying long quality tech.", time: "1d ago" },
  ]);
  const [selectedSpecialties, setSelectedSpecialties] = useState(analyst.specialties || []);
  const [freeReports, setFreeReports] = useState(["r1"]);

  const toggleSpecialty = (s) => {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const toggleFreeReport = (id) => {
    setFreeReports((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const postTweet = () => {
    if (!tweet.trim()) return;
    setTweets((prev) => [{ id: Date.now(), content: tweet.trim(), time: "just now" }, ...prev]);
    setTweet("");
  };

  const handleSave = () => {
    toast.success("Profile saved!");
    navigate("/dashboard");
  };

  const myReports = MOCK_REPORTS.filter((r) => r.author.id === analyst.id);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setTab(tab === "preview" ? "edit" : "preview")}>
            <Eye className="w-4 h-4 mr-1.5" />
            {tab === "preview" ? "Edit" : "Preview"}
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1.5" /> Save
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="tweets">Quick Twits</TabsTrigger>
          <TabsTrigger value="free-reports">Free Preview Reports</TabsTrigger>
          <TabsTrigger value="preview">Profile Preview</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "edit" && (
        <div className="space-y-6">
          {/* Avatar */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Branding</h3>
            <div className="flex items-center gap-5">
              <div className="relative">
                <img src={analyst.avatar} alt={analyst.name} className="w-20 h-20 rounded-2xl object-cover ring-2 ring-border" />
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 space-y-3">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display Name" />
                <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline (shown under your name)" />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-3">Bio</h3>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell followers about your background, approach, and specialties..." className="min-h-[100px]" />
            <p className="text-xs text-muted-foreground mt-2 text-right">{bio.length}/500</p>
          </div>

          {/* Specialties */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_OPTIONS.map((s) => (
                <button key={s} onClick={() => toggleSpecialty(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${selectedSpecialties.includes(s) ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Social Links</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Twitter className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="Twitter / X handle" />
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn username" />
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Personal website" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "tweets" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">Post a Quick Twit</h3>
            <Textarea value={tweet} onChange={(e) => setTweet(e.target.value)} placeholder="Share a quick market thought, trade idea, or commentary..." className="min-h-[80px]" />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-muted-foreground">{tweet.length}/280</span>
              <Button size="sm" onClick={postTweet}>Post Twit</Button>
            </div>
          </div>
          <div className="space-y-3">
            {tweets.map((t) => (
              <div key={t.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img src={analyst.avatar} alt={analyst.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-sm font-semibold">{analyst.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{t.time}</span>
                </div>
                <p className="text-sm text-foreground/80">{t.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "free-reports" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">Select which of your reports visitors can read for free as a preview of your analysis style.</p>
          {myReports.map((report) => (
            <div key={report.id} className={`border rounded-xl p-4 cursor-pointer transition-all ${freeReports.includes(report.id) ? "border-primary bg-primary/5" : "border-border bg-card hover:border-border/80"}`}
              onClick={() => toggleFreeReport(report.id)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{report.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{report.likes} likes</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${freeReports.includes(report.id) ? "border-primary bg-primary" : "border-border"}`}>
                  {freeReports.includes(report.id) && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "preview" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Cover */}
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <div className="px-6 pb-6 -mt-10">
            <img src={analyst.avatar} alt={analyst.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-card mb-3" />
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-sm text-muted-foreground mb-2">{tagline}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSpecialties.map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
            </div>
            <p className="text-sm text-foreground/80 mb-4">{bio}</p>
            <div className="flex gap-3 text-xs text-muted-foreground mb-4">
              {twitter && <span className="flex items-center gap-1"><Twitter className="w-3 h-3 text-sky-500" />{twitter}</span>}
              {website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{website}</span>}
            </div>
            <h3 className="font-semibold text-sm mb-3">Free Preview Reports</h3>
            <div className="space-y-3">
              {myReports.filter((r) => freeReports.includes(r.id)).map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}