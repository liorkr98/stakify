import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Twitter, Globe, Linkedin, UserPlus, MessageCircle, BarChart3, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ANALYSTS, MOCK_REPORTS } from "@/lib/mockData";
import ReportCard from "@/components/feed/ReportCard";

export default function AnalystProfilePage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const analystId = urlParams.get("id") || "a2";

  const analyst = MOCK_ANALYSTS.find((a) => a.id === analystId) || MOCK_ANALYSTS[1];
  const myReports = MOCK_REPORTS.filter((r) => r.author.id === analyst.id);

  const [following, setFollowing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const socialLinks = {
    twitter: analyst.id === "a1" ? "@sarahchen_finance" : analyst.id === "a2" ? "@marcuswebb" : null,
    linkedin: analyst.id === "a1" ? "sarahchen" : analyst.id === "a2" ? "marcuswebb" : null,
    website: analyst.id === "a1" ? "sarahchen.com" : null,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Profile Header Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <img
              src={analyst.avatar}
              alt={analyst.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-card"
            />
            <div className="flex gap-2">
              <Button
                variant={subscribed ? "secondary" : "default"}
                size="sm"
                className={subscribed ? "bg-primary/10 text-primary border border-primary/30" : "bg-primary text-white"}
                onClick={() => setSubscribed(!subscribed)}
              >
                <Star className="w-3.5 h-3.5 mr-1.5" />
                {subscribed ? "Subscribed" : "Subscribe $9/mo"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={following ? "border-primary/30 text-primary bg-primary/5" : ""}
                onClick={() => setFollowing(!following)}
              >
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                {following ? "Following" : "Follow"}
              </Button>
              {subscribed && (
                <Button variant="outline" size="sm" onClick={() => navigate(`/dm?analyst=${analyst.id}`)}>
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Message
                </Button>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1">{analyst.name}</h1>
          <p className="text-sm text-muted-foreground mb-3">{analyst.bio}</p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(analyst.specialties || []).map((s) => (
              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-4 flex-wrap text-sm">
            {socialLinks.twitter && (
              <a
                href={`https://twitter.com/${socialLinks.twitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sky-500 hover:text-sky-600 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
                {socialLinks.twitter}
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={`https://linkedin.com/in/${socialLinks.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                {socialLinks.linkedin}
              </a>
            )}
            {socialLinks.website && (
              <a
                href={`https://${socialLinks.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {socialLinks.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Accuracy", value: `${analyst.accuracy}%`, icon: BarChart3, color: "text-primary" },
          { label: "Yearly Yield", value: `+${analyst.yearlyYield}%`, icon: Star, color: "text-amber-500" },
          { label: "Followers", value: analyst.followers.toLocaleString(), icon: UserPlus, color: "text-blue-500" },
          { label: "Reports", value: analyst.reports, icon: FileText, color: "text-muted-foreground" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <Icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Reports */}
      <div>
        <h2 className="text-lg font-bold mb-4">Published Reports</h2>
        {myReports.length === 0 ? (
          <p className="text-muted-foreground text-sm">No published reports yet.</p>
        ) : (
          <div className="space-y-4">
            {myReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}