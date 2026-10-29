import React, { useEffect, useMemo, useState, useRef } from "react";
import logoUrl from "./assets/75dfc9f884f0c38d-99630AD0-413D-439B-8A63-79E5B44A9CBA.png";
import { crmAction } from "../lib/crmApi";
import {
  LayoutDashboard,
  Database,
  Activity,
  Kanban,
  Ticket,
  MessageSquare,
  FolderGit2,
  ShieldCheck,
  CreditCard,
  Search,
  Filter,
  Download,
  Upload,
  Sparkles,
  Building2,
  MapPin,
  Phone,
  MoreHorizontal,
  Plus,
  X,
  Check,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  Zap,
  ChevronRight,
  ExternalLink,
  Play,
  Send,
  Paperclip,
  Shield,
  Award,
  Lock,
  Globe,
  BarChart3,
  Target,
  Timer,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Types
type Lead = {
  companyName: string;
  address: string;
  postcode: string;
  postcodeArea: string;
  phone: string;
  motClasses: string;
  companiesHouseStatus: "Active" | "Dissolved" | "Liquidation";
  score: number;
  aiIcebreaker: string;
  status: "New" | "Contacted" | "Qualified";
  source: string;
};

type Engagement = {
  leadId: string;
  leadName: string;
  date: string;
  type: "Call" | "Meeting" | "Email" | "AVA Chat" | "Site Visit";
  duration: string;
  notes: string;
  outcome: string;
  evidenceFile: string;
  govStandard: string;
};

type Negotiation = {
  leadId: string;
  leadName: string;
  value: number;
  probability: number;
  stage: "Lead" | "Contacted" | "Tech Assessment" | "Proposal Sent" | "Negotiation" | "Won" | "Lost";
  nextAction: string;
  daysInStage: number;
  owner: string;
  retainer: string;
};

type TicketItem = {
  ticketId: string;
  title: string;
  project: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  assignee: string;
  due: string;
  column: "To Do" | "In Progress" | "Review" | "Done";
  client: string;
};

type Chat = {
  leadName: string;
  lastMessage: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  jobScore: number;
  origin: "Floating Widget" | "Contact OS";
  transcript: { from: "lead" | "ava" | "captain"; text: string; time: string }[];
  techAssessment: string;
};

// Sample Data
const SAMPLE_LEADS: Lead[] = [
  { companyName: "Oldham MOT Centre", address: "123 Yorkshire St, Oldham", postcode: "OL8 1JR", postcodeArea: "OL", phone: "0161 624 1234", motClasses: "Class 4", companiesHouseStatus: "Active", score: 92, aiIcebreaker: "Hi Oldham MOT Centre - Saw you do Class 4 MOTs in Oldham with 400+ reviews. Your DVSA pass rate is impressive. Quick question about booking flow?", status: "Qualified", source: "DVSA Active" },
  { companyName: "Shaw MOT & Service", address: "45 Beal Lane, Shaw", postcode: "OL2 8PH", postcodeArea: "OL", phone: "01706 842 211", motClasses: "Class 4, 7", companiesHouseStatus: "Active", score: 88, aiIcebreaker: "Hi Shaw MOT - Noticed you cover Class 7 vans in OL2, rare in Greater Manchester. Are you still manually handling fleet bookings?", status: "Contacted", source: "DVSA Active" },
  { companyName: "Royton Garage Services", address: "98 Rochdale Rd, Royton", postcode: "OL2 5XJ", postcodeArea: "OL", phone: "0161 624 9988", motClasses: "Class 4", companiesHouseStatus: "Active", score: 76, aiIcebreaker: "Hi Royton Garage - Saw your MOT bay handles Class 4 in Royton. We help garages like yours cut no-shows by 34% - open to chat?", status: "Contacted", source: "DVSA Active" },
  { companyName: "Chadderton Vehicle Testing", address: "12 Broadway, Chadderton", postcode: "OL9 9XA", postcodeArea: "OL", phone: "0161 652 3344", motClasses: "Class 4, 5", companiesHouseStatus: "Active", score: 81, aiIcebreaker: "Hi Chadderton Vehicle - Your Class 5 minibus MOT capability in OL9 is niche. Are you capturing school contract leads digitally?", status: "New", source: "DVSA Active" },
  { companyName: "Failsworth MOT Station", address: "200 Oldham Rd, Failsworth", postcode: "M35 0AW", postcodeArea: "M", phone: "0161 681 5566", motClasses: "Class 4", companiesHouseStatus: "Active", score: 69, aiIcebreaker: "Hi Failsworth - Saw you in M35 doing Class 4. Curious how you handle DVSA integration for bookings currently?", status: "New", source: "DVSA Active" },
  { companyName: "Hollinwood Motors", address: "Manchester Rd, Hollinwood", postcode: "OL8 4QZ", postcodeArea: "OL", phone: "0161 620 7788", motClasses: "Class 4, 7", companiesHouseStatus: "Active", score: 94, aiIcebreaker: "Hi Hollinwood - Your OL8 site with Class 7 is exactly what fleet operators need. We built Vexo Garage for this - want a peek?", status: "Qualified", source: "Companies House" },
  { companyName: "Lees Road MOT", address: "7 Lees Rd, Oldham", postcode: "OL4 5DA", postcodeArea: "OL", phone: "0161 624 4455", motClasses: "Class 4", companiesHouseStatus: "Dissolved", score: 42, aiIcebreaker: "Hi Lees Road - Noticed Companies House shows dissolved but DVSA active. Are you still operating MOTs?", status: "New", source: "DVSA Active" },
  { companyName: "Glodwick Test Centre", address: "Glodwick Rd, Oldham", postcode: "OL4 1BN", postcodeArea: "OL", phone: "0161 624 3322", motClasses: "Class 4", companiesHouseStatus: "Active", score: 85, aiIcebreaker: "Hi Glodwick - Saw your Class 4 MOTs in OL4. Your location near Oldham centre must be busy - still taking walk-ins?", status: "Contacted", source: "DVSA Active" },
  { companyName: "Werneth MOT Solutions", address: "Werneth Hall Rd, Oldham", postcode: "OL8 2QJ", postcodeArea: "OL", phone: "0161 628 9900", motClasses: "Class 4", companiesHouseStatus: "Active", score: 78, aiIcebreaker: "Hi Werneth - Your MOT solutions in OL8 caught eye. We help Oldham garages automate MOT reminders - 28% uplift?", status: "New", source: "DVSA Active" },
  { companyName: "Coppice MOT Centre", address: "Coppice St, Oldham", postcode: "OL8 1AU", postcodeArea: "OL", phone: "0161 620 1112", motClasses: "Class 4", companiesHouseStatus: "Active", score: 91, aiIcebreaker: "Hi Coppice - Your Class 4 bay in OL8 with high throughput - are you losing hours to phone bookings?", status: "Qualified", source: "DVSA Active" },
  { companyName: "Oldham Autocare MOT", address: "Ashton Rd, Oldham", postcode: "OL8 4LL", postcodeArea: "OL", phone: "0161 624 5544", motClasses: "Class 4, 7", companiesHouseStatus: "Active", score: 87, aiIcebreaker: "Hi Autocare - Saw you do Class 4 & 7 in OL8, impressive dual setup. How are you handling van fleet seasonality?", status: "Contacted", source: "DVSA Active" },
  { companyName: "Greenacres MOT Hub", address: "Greenacres Rd, Oldham", postcode: "OL4 3AG", postcodeArea: "OL", phone: "0161 621 2233", motClasses: "Class 4", companiesHouseStatus: "Active", score: 73, aiIcebreaker: "Hi Greenacres - Your OL4 MOT hub looks solid. Are you using TradeFlow for parts yet or manual?", status: "New", source: "DVSA Active" },
  { companyName: "Mossley SK MOT", address: "Stockport Rd, Mossley", postcode: "SK15 2AG", postcodeArea: "SK", phone: "01457 833 445", motClasses: "Class 4", companiesHouseStatus: "Active", score: 80, aiIcebreaker: "Hi Mossley SK - Saw you cover SK15 Class 4, border zone between GM & Derbyshire. Complex for bookings?", status: "New", source: "DVSA Active" },
  { companyName: "Bolton BL Garage MOT", address: "Blackburn Rd, Bolton", postcode: "BL1 8HE", postcodeArea: "BL", phone: "01204 555 667", motClasses: "Class 4, 5", companiesHouseStatus: "Active", score: 84, aiIcebreaker: "Hi Bolton BL Garage - Your BL1 site with Class 5 is gold for minibus operators. Still paper logbooks?", status: "Contacted", source: "DVSA Active" },
  { companyName: "Fitton Hill Garage", address: "Fitton Hill Rd, Oldham", postcode: "OL8 2QD", postcodeArea: "OL", phone: "0161 627 8899", motClasses: "Class 4", companiesHouseStatus: "Liquidation", score: 38, aiIcebreaker: "Hi Fitton Hill - Companies House flags liquidation but DVSA still active - clarification on MOT status?", status: "New", source: "Companies House" },
];

const SAMPLE_ENGAGEMENTS: Engagement[] = [
  { leadId: "0", leadName: "Oldham MOT Centre", date: "2025-11-18", type: "Call", duration: "12m", notes: "Discovery call - booking pain, 40% no-shows, owner wants automation", outcome: "Qualified - Tech Assessment booked", evidenceFile: "call_recording_18nov.mp3", govStandard: "Discovery" },
  { leadId: "0", leadName: "Oldham MOT Centre", date: "2025-11-20", type: "Meeting", duration: "45m", notes: "On-site Alpha - mapped customer journey, MOT bay utilization", outcome: "Proposal scope agreed £28k", evidenceFile: "onsite_photos_alpha.zip", govStandard: "Alpha" },
  { leadId: "1", leadName: "Shaw MOT & Service", date: "2025-11-15", type: "AVA Chat", duration: "8m", notes: "AVA handled booking query, scored 82 job fit, handover to Captain", outcome: "Contacted - warm lead", evidenceFile: "ava_chat_15nov.json", govStandard: "Beta" },
  { leadId: "5", leadName: "Hollinwood Motors", date: "2025-11-10", type: "Email", duration: "-", notes: "Sent Vexo Garage demo link with DVSA integration video", outcome: "Opened 3x, clicked demo", evidenceFile: "email_thread.eml", govStandard: "Beta" },
  { leadId: "3", leadName: "Chadderton Vehicle Testing", date: "2025-11-08", type: "Site Visit", duration: "2h", notes: "Beta testing Vexo booking widget live", outcome: "Feedback: needs Class 5 support", evidenceFile: "beta_test_notes.md", govStandard: "Live" },
];

const SAMPLE_NEGOTIATIONS: Negotiation[] = [
  { leadId: "0", leadName: "Oldham MOT Centre", value: 28000, probability: 80, stage: "Proposal Sent", nextAction: "Awaiting PO - 50% upfront", daysInStage: 3, owner: "Captain", retainer: "£3k/mo" },
  { leadId: "5", leadName: "Hollinwood Motors", value: 45000, probability: 60, stage: "Tech Assessment", nextAction: "DVSA API scope validation", daysInStage: 7, owner: "Senior Dev 1", retainer: "£5k/mo" },
  { leadId: "1", leadName: "Shaw MOT & Service", value: 15000, probability: 40, stage: "Contacted", nextAction: "Demo Vexo Garage OS", daysInStage: 12, owner: "Captain", retainer: "£3k/mo" },
  { leadId: "10", leadName: "Oldham Autocare MOT", value: 32000, probability: 70, stage: "Negotiation", nextAction: "Final pricing - TradeFlow bundle", daysInStage: 5, owner: "Senior Dev 2", retainer: "£4k/mo" },
  { leadId: "11", leadName: "Coppice MOT Centre", value: 18000, probability: 90, stage: "Won", nextAction: "Kickoff + onboarding", daysInStage: 1, owner: "Captain", retainer: "£3k/mo" },
  { leadId: "13", leadName: "Bolton BL Garage MOT", value: 22000, probability: 30, stage: "Lead", nextAction: "Initial outreach - Class 5 angle", daysInStage: 20, owner: "Senior Dev 1", retainer: "£3k/mo" },
];

const SAMPLE_TICKETS: TicketItem[] = [
  { ticketId: "VEXO-102", title: "DVSA MOT history API integration", project: "Vexo Garage", priority: "Critical", assignee: "Senior Dev 1", due: "2025-11-28", column: "In Progress", client: "Oldham MOT Centre" },
  { ticketId: "VEXO-98", title: "Booking widget - Class 4/7 toggle", project: "Vexo Garage", priority: "High", assignee: "Captain", due: "2025-11-25", column: "Review", client: "Oldham MOT Centre" },
  { ticketId: "VISA-44", title: "VisaGuide OS - 12 OS flow audit", project: "VisaGuide OS", priority: "High", assignee: "Senior Dev 2", due: "2025-12-01", column: "To Do", client: "Global" },
  { ticketId: "TRADE-21", title: "TradeFlow Guardian 15% logic", project: "TradeFlow OS", priority: "Medium", assignee: "Senior Dev 1", due: "2025-11-30", column: "In Progress", client: "Internal" },
  { ticketId: "REEL-09", title: "ReelStorm UE5.8 room 12 lighting", project: "ReelStorm", priority: "Medium", assignee: "Senior Dev 2", due: "2025-12-05", column: "To Do", client: "Studio" },
  { ticketId: "VEXO-101", title: "AVA handover to Captain - sentiment threshold", project: "Vexo Garage", priority: "High", assignee: "Captain", due: "2025-11-22", column: "Done", client: "Oldham MOT Centre" },
  { ticketId: "ROAD-07", title: "Road Angel - ADAS calibration log", project: "Road Angel", priority: "Low", assignee: "Senior Dev 1", due: "2025-12-10", column: "To Do", client: "Road Angel" },
  { ticketId: "VEXO-103", title: "SMS MOT reminder - S3 SES template", project: "Vexo Garage", priority: "High", assignee: "Senior Dev 2", due: "2025-11-26", column: "To Do", client: "Oldham MOT Centre" },
];

const SAMPLE_CHATS: Chat[] = [
  { leadName: "Oldham MOT Centre", lastMessage: "Can AVA handle Class 7 van fleet?", sentiment: "Positive", jobScore: 88, origin: "Contact OS", transcript: [{ from: "lead", text: "Do you handle Class 7 MOTs for our Transit fleet?", time: "14:32" }, { from: "ava", text: "Yes - Vexo Garage OS supports Class 4 & 7 with fleet batch booking. DVSA integrated.", time: "14:32" }, { from: "lead", text: "Can AVA handle 12 vans same day?", time: "14:33" }], techAssessment: "Fleet booking - 12 vans, needs batch calendar, high intent" },
  { leadName: "Shaw MOT & Service", lastMessage: "Pricing for 2 sites?", sentiment: "Positive", jobScore: 82, origin: "Floating Widget", transcript: [{ from: "lead", text: "We have 2 sites in OL2 - pricing?", time: "09:15" }, { from: "ava", text: "Multi-site £49 + £10 per site with TradeFlow Guardian. Includes AVA.", time: "09:16" }], techAssessment: "Multi-site - 2 locations, wants unified inbox" },
  { leadName: "Hollinwood Motors", lastMessage: "Demo link broken", sentiment: "Negative", jobScore: 45, origin: "Contact OS", transcript: [{ from: "lead", text: "Demo link 404", time: "11:02" }, { from: "ava", text: "Apologies - sending fresh link with Loom walkthrough.", time: "11:03" }], techAssessment: "Link rot - needs follow-up, low trust" },
];

const MONTHLY_LEADS = [
  { month: "Jan", contacted: 18, qualified: 6 },
  { month: "Feb", contacted: 24, qualified: 9 },
  { month: "Mar", contacted: 32, qualified: 12 },
  { month: "Apr", contacted: 28, qualified: 11 },
  { month: "May", contacted: 41, qualified: 16 },
  { month: "Jun", contacted: 38, qualified: 14 },
  { month: "Jul", contacted: 52, qualified: 19 },
  { month: "Aug", contacted: 61, qualified: 22 },
  { month: "Sep", contacted: 58, qualified: 24 },
  { month: "Oct", contacted: 72, qualified: 28 },
  { month: "Nov", contacted: 84, qualified: 31 },
  { month: "Dec", contacted: 40, qualified: 15 },
];

const ENGAGEMENT_TYPES = [
  { name: "Calls", value: 42, color: "#0EA5FF" },
  { name: "Meetings", value: 18, color: "#84FF3D" },
  { name: "AVA Chats", value: 51, color: "#FFD700" },
  { name: "Tickets", value: 16, color: "#A78BFA" },
];

const COMPLIANCE_ITEMS = [
  { id: 1, title: "Service Standard - Discovery", status: "Done", evidence: 8, last: "2025-11-18", cat: "Discovery" },
  { id: 2, title: "Service Standard - Alpha", status: "Done", evidence: 12, last: "2025-11-20", cat: "Alpha" },
  { id: 3, title: "Service Standard - Beta", status: "In Progress", evidence: 6, last: "2025-11-15", cat: "Beta" },
  { id: 4, title: "Service Standard - Live", status: "Todo", evidence: 0, last: "-", cat: "Live" },
  { id: 5, title: "WCAG 2.2 AA Audit", status: "Done", evidence: 14, last: "2025-11-12", cat: "Accessibility" },
  { id: 6, title: "ISO 27001 Controls", status: "In Progress", evidence: 9, last: "2025-11-19", cat: "Security" },
  { id: 7, title: "PCI DSS SAQ A", status: "Done", evidence: 5, last: "2025-11-10", cat: "Security" },
  { id: 8, title: "Cyber Essentials", status: "Done", evidence: 7, last: "2025-11-08", cat: "Security" },
  { id: 9, title: "GDPR Data Mapping", status: "In Progress", evidence: 11, last: "2025-11-21", cat: "Privacy" },
  { id: 10, title: "GOV.UK Prototype Evidence", status: "Done", evidence: 19, last: "2025-11-21", cat: "Discovery" },
];

const PROJECTS = [
  { name: "VisaGuide OS", desc: "12 OS, Immigration advisory engine", mrr: "£20K MRR", progress: 82, color: "#0EA5FF", tickets: 4, billing: "£48K pipeline" },
  { name: "ReelStorm", desc: "18 rooms, UE5.8 virtual production", mrr: "Studio Retainer", progress: 64, color: "#FFD700", tickets: 1, billing: "£60K project" },
  { name: "Vexo Garage", desc: "DVSA MOT booking + AVA", mrr: "£49+£10/site", progress: 76, color: "#84FF3D", tickets: 5, billing: "£85K pipeline" },
  { name: "TradeFlow OS", desc: "Guardian 8/15/25%, parts flow", mrr: "£49+10% margin", progress: 71, color: "#A78BFA", tickets: 1, billing: "£32K MRR" },
  { name: "Arole Adjo", desc: "Creator OS - bookings & CRM", mrr: "£3K/mo", progress: 58, color: "#F472B6", tickets: 2, billing: "£18K" },
  { name: "Road Angel", desc: "ADAS calibration logging", mrr: "£4K/mo", progress: 45, color: "#FBBF24", tickets: 1, billing: "£12K" },
];

async function apiList(collection: string) {
  return crmAction<{ records: { id: string; value: any }[] }>("records.list", {
    collection,
    limit: 100,
  });
}

async function apiCreate(collection: string, value: any, idempotency_key?: string) {
  return crmAction<{ id: string; value: any }>("records.create", {
    collection,
    value,
    idempotency_key,
  });
}

async function apiReplace(collection: string, id: string, value: any) {
  return crmAction("records.replace", { collection, id, value });
}

async function apiDelete(collection: string, id: string) {
  return crmAction<boolean>("records.delete", { collection, id });
}

export default function App() {
  const [role, setRole] = useState<"admin" | "user">("admin");
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [leads, setLeads] = useState<{ id: string; value: Lead }[]>([]);
  const [engagements, setEngagements] = useState<{ id: string; value: Engagement }[]>([]);
  const [negotiations, setNegotiations] = useState<{ id: string; value: Negotiation }[]>([]);
  const [tickets, setTickets] = useState<{ id: string; value: TicketItem }[]>([]);
  const [chats, setChats] = useState<{ id: string; value: Chat }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterArea, setFilterArea] = useState("All");
  const [search, setSearch] = useState("");
  const [showEngagementModal, setShowEngagementModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [dragTicket, setDragTicket] = useState<string | null>(null);
  const [importBusy, setImportBusy] = useState(false);
  const [importResult, setImportResult] = useState<{ saved: number; remaining: number; error: string | null } | null>(null);
  const [vaultProgress] = useState(73);
  const [newEng, setNewEng] = useState<Partial<Engagement>>({ type: "Call", govStandard: "Discovery" });

  const tabs = ["Dashboard", "Leads", "Engagement", "Negotiations", "Tickets", "Chats", "Projects", "Vault", "Billing"];

  // Load
  const reloadAll = async () => {
    try {
      const [l, e, n, t, c] = await Promise.all([
        apiList("leads"),
        apiList("engagements"),
        apiList("negotiations"),
        apiList("tickets"),
        apiList("chats"),
      ]);
      setLeads(l.records as any);
      setEngagements(e.records as any);
      setNegotiations(n.records as any);
      setTickets(t.records as any);
      setChats(c.records as any);

      // seed if empty
      if (l.records.length === 0) {
        for (let i = 0; i < SAMPLE_LEADS.length; i++) {
          try {
            await apiCreate("leads", SAMPLE_LEADS[i], `lead-seed-${i}-${SAMPLE_LEADS[i].companyName}`);
          } catch {}
        }
      }
      if (e.records.length === 0) {
        for (let i = 0; i < SAMPLE_ENGAGEMENTS.length; i++) {
          try {
            await apiCreate("engagements", SAMPLE_ENGAGEMENTS[i], `eng-seed-${i}`);
          } catch {}
        }
      }
      if (n.records.length === 0) {
        for (let i = 0; i < SAMPLE_NEGOTIATIONS.length; i++) {
          try {
            await apiCreate("negotiations", SAMPLE_NEGOTIATIONS[i], `nego-seed-${i}`);
          } catch {}
        }
      }
      if (t.records.length === 0) {
        for (let i = 0; i < SAMPLE_TICKETS.length; i++) {
          try {
            await apiCreate("tickets", SAMPLE_TICKETS[i], `ticket-seed-${i}`);
          } catch {}
        }
      }
      if (c.records.length === 0) {
        for (let i = 0; i < SAMPLE_CHATS.length; i++) {
          try {
            await apiCreate("chats", SAMPLE_CHATS[i], `chat-seed-${i}`);
          } catch {}
        }
      }
      // reload again after seeding
      if (l.records.length === 0) {
        const re = await apiList("leads");
        setLeads(re.records as any);
      }
    } catch (err) {
      console.warn("API unavailable, using local sample", err);
      // fallback to local sample mapped to fake ids
      setLeads(SAMPLE_LEADS.map((v, i) => ({ id: `local-${i}`, value: v })));
      setEngagements(SAMPLE_ENGAGEMENTS.map((v, i) => ({ id: `local-e-${i}`, value: v })));
      setNegotiations(SAMPLE_NEGOTIATIONS.map((v, i) => ({ id: `local-n-${i}`, value: v })));
      setTickets(SAMPLE_TICKETS.map((v, i) => ({ id: `local-t-${i}`, value: v })));
      setChats(SAMPLE_CHATS.map((v, i) => ({ id: `local-c-${i}`, value: v })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadAll();
  }, []);

  // Derived metrics
  const totalLeads = leads.length || 400;
  const totalEngagements = engagements.length || 127;
  const pipelineValue = negotiations.reduce((s, n) => s + (n.value.value || 0), 0) || 85000;
  const weighted = negotiations.reduce((s, n) => s + (n.value.value * n.value.probability) / 100, 0) || 45000;

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const v = l.value;
      const matchSearch = !search || v.companyName.toLowerCase().includes(search.toLowerCase()) || v.postcode.toLowerCase().includes(search.toLowerCase());
      const matchArea = filterArea === "All" || v.postcodeArea === filterArea || (filterArea === "Score>70" && v.score > 70);
      return matchSearch && matchArea;
    });
  }, [leads, search, filterArea]);

  // Import DVSA simulation with required control flow pattern
  const handleImportDVSA = async () => {
    setImportBusy(true);
    const newRows: Lead[] = [
      { companyName: "Oldham Central MOT", address: "Union St, Oldham", postcode: "OL1 1AA", postcodeArea: "OL", phone: "0161 624 7777", motClasses: "Class 4", companiesHouseStatus: "Active", score: 79, aiIcebreaker: "Hi Oldham Central - Saw Class 4 in OL1, central location must be busy. Still manual bookings?", status: "New", source: "DVSA CSV 2025-11-21" },
      { companyName: "Derker MOT Bay", address: "Derker St, Oldham", postcode: "OL1 4JE", postcodeArea: "OL", phone: "0161 624 6666", motClasses: "Class 4", companiesHouseStatus: "Active", score: 68, aiIcebreaker: "Hi Derker MOT - OL1 garage spotted in latest DVSA Active list. Are you capturing online MOTs?", status: "New", source: "DVSA CSV 2025-11-21" },
      { companyName: "Moston M MOT", address: "Moston Lane, Manchester", postcode: "M40 9WB", postcodeArea: "M", phone: "0161 682 1234", motClasses: "Class 4, 7", companiesHouseStatus: "Active", score: 82, aiIcebreaker: "Hi Moston MOT - Class 7 in M40 is rare. Fleet operators must love you - need better funnel?", status: "New", source: "DVSA CSV 2025-11-21" },
    ];

    // validate and deduplicate
    const rows = newRows.filter((r, idx, self) => self.findIndex((x) => x.companyName === r.companyName) === idx);

    let saved = 0;
    let error: string | null = null;
    try {
      for (const row of rows) {
        await apiCreate("leads", row, `import-${row.companyName}-${Date.now()}`);
        saved += 1;
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    let reloadError: string | null = null;
    try {
      const data = await apiList("leads");
      setLeads(data.records as any);
    } catch (e) {
      reloadError = e instanceof Error ? e.message : String(e);
    }
    setImportResult({ saved, remaining: rows.length - saved, error: error || reloadError });
    setImportBusy(false);
    setTimeout(() => setImportResult(null), 4000);
  };

  const handleEnrich = async () => {
    // simulate enrich by increasing scores
    for (const l of filteredLeads.slice(0, 3)) {
      try {
        await apiReplace("leads", l.id, { ...l.value, score: Math.min(100, l.value.score + 5), companiesHouseStatus: "Active" as const });
      } catch {}
    }
    const data = await apiList("leads").catch(() => null);
    if (data) setLeads(data.records as any);
  };

  const handleCreateEngagement = async () => {
    if (!newEng.leadName || !newEng.notes) return;
    try {
      await apiCreate("engagements", {
        leadId: "0",
        leadName: newEng.leadName || "Oldham MOT Centre",
        date: new Date().toISOString().split("T")[0],
        type: newEng.type || "Call",
        duration: "10m",
        notes: newEng.notes,
        outcome: newEng.outcome || "Logged",
        evidenceFile: `evidence_${Date.now()}.pdf`,
        govStandard: newEng.govStandard || "Discovery",
      });
      const data = await apiList("engagements");
      setEngagements(data.records as any);
      setShowEngagementModal(false);
      setNewEng({ type: "Call", govStandard: "Discovery" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleTicketDrop = async (col: TicketItem["column"]) => {
    if (!dragTicket) return;
    const t = tickets.find((x) => x.id === dragTicket);
    if (!t) return;
    try {
      await apiReplace("tickets", t.id, { ...t.value, column: col });
      const data = await apiList("tickets");
      setTickets(data.records as any);
    } catch {}
    setDragTicket(null);
  };

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full overflow-x-clip bg-[var(--bg)] text-zinc-100 selection:bg-[#0EA5FF]/30"
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)", backgroundColor: "#05070D" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        :root {
          --bg: #05070D;
          --surface: #0B1020;
          --surface-2: #121A2E;
          --surface-3: #17213A;
          --border: rgba(255,255,255,0.08);
          --border-2: rgba(255,255,255,0.12);
          --blue: #0EA5FF;
          --green: #84FF3D;
          --gold: #FFD700;
          --text: #E6E8EF;
          --muted: #8B90A3;
        }
        * { font-family: 'Inter', system-ui, sans-serif; }
        h1,h2,h3,.sora { font-family: 'Sora', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .glass {
          background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
        }
        .glass-strong {
          background: linear-gradient(180deg, rgba(18,26,46,0.9) 0%, rgba(11,16,32,0.9) 100%);
          backdrop-filter: blur(24px);
          border: 1px solid var(--border);
        }
        .shimmer {
          position: relative; overflow: hidden;
        }
        .shimmer::after {
          content: ''; position: absolute; top:0; left:-100%; width:100%; height:100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: shimmer 2.5s infinite;
        }
        @keyframes shimmer { 100% { left: 100%; } }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <header
        data-safe-area-sticky-top
        className="sticky z-40 border-b border-white/[0.06] bg-[#05070D]/80 backdrop-blur-2xl"
        style={{ top: "var(--safe-area-inset-top)" }}
      >
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="AiKOVA" className="h-8 w-auto object-contain md:h-9" />
            <div className="hidden items-center gap-2 md:flex">
              <span className="sora text-[15px] font-semibold tracking-tight">AiKOVA</span>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium tracking-widest text-zinc-400">DOS7 VAULT</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Toggle */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
              <span className="hidden px-2 text-[11px] font-medium tracking-wide text-zinc-400 md:block">View as:</span>
              <button
                onClick={() => setRole("user")}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all ${role === "user" ? "bg-white text-black shadow" : "text-zinc-400 hover:text-white"}`}
              >
                User (Client)
              </button>
              <button
                onClick={() => setRole("admin")}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all ${role === "admin" ? "bg-[#0EA5FF] text-black shadow shadow-[#0EA5FF]/20" : "text-zinc-400 hover:text-white"}`}
              >
                Admin (Captain)
              </button>
            </div>
            <div className="hidden h-6 w-px bg-white/10 md:block" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#0EA5FF] to-[#84FF3D] p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#05070D] text-[11px] font-bold">CP</div>
              </div>
              <div className="hidden md:block">
                <div className="text-[12px] font-semibold leading-none">Captain</div>
                <div className="text-[10px] text-zinc-500">Owner • AiKOVA</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="border-b border-white/[0.06] bg-[#0B1020]">
        <div className="mx-auto flex max-w-[1920px] items-center gap-0 overflow-x-auto px-2 py-2 scrollbar-none md:px-6 md:py-2.5">
          {[
            { k: "Total Leads", v: `${totalLeads}+`, sub: "23K imported", icon: Database },
            { k: "Engagements", v: `${totalEngagements}`, sub: "127 target", icon: Activity },
            { k: "Active Negotiations", v: `£${Math.round(pipelineValue / 1000)}K`, sub: `£${Math.round(weighted / 1000)}K weighted`, icon: TrendingUp },
            { k: "Tickets", v: `${tickets.length || 23}`, sub: "4 in review", icon: Ticket },
            { k: "Evidence", v: `${vaultProgress}% → 100%`, sub: "DOS7 vault", icon: ShieldCheck, highlight: true },
            { k: "Days until DOS7", v: "87", sub: "12-month plan", icon: Timer },
          ].map((m) => (
            <div key={m.k} className="flex min-w-[160px] flex-1 items-center gap-3 border-r border-white/[0.06] px-4 last:border-0">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${m.highlight ? "bg-[#FFD700]/10 text-[#FFD700]" : "bg-white/[0.06] text-zinc-400"}`}>
                <m.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-zinc-500">{m.k}</div>
                <div className={`sora text-[14px] font-semibold ${m.highlight ? "text-[#FFD700]" : "text-white"}`}>{m.v}</div>
                <div className="text-[10px] text-zinc-500">{m.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="sticky top-[calc(var(--safe-area-inset-top)+57px)] z-30 border-b border-white/[0.06] bg-[#05070D]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1920px] items-center gap-1 overflow-x-auto px-2 py-2 scrollbar-none md:px-6">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`group flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-[12px] font-medium transition-all md:px-4 ${
                activeTab === t ? "border-[#0EA5FF]/30 bg-[#0EA5FF]/10 text-white" : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-white/10 hover:text-zinc-200"
              }`}
            >
              {t === "Dashboard" && <LayoutDashboard className="h-3.5 w-3.5" />}
              {t === "Leads" && <Database className="h-3.5 w-3.5" />}
              {t === "Engagement" && <Activity className="h-3.5 w-3.5" />}
              {t === "Negotiations" && <Kanban className="h-3.5 w-3.5" />}
              {t === "Tickets" && <Ticket className="h-3.5 w-3.5" />}
              {t === "Chats" && <MessageSquare className="h-3.5 w-3.5" />}
              {t === "Projects" && <FolderGit2 className="h-3.5 w-3.5" />}
              {t === "Vault" && <ShieldCheck className="h-3.5 w-3.5" />}
              {t === "Billing" && <CreditCard className="h-3.5 w-3.5" />}
              {t}
              {t === "Leads" && <span className="ml-1 rounded-full bg-[#0EA5FF] px-1.5 py-0.5 text-[10px] font-bold text-black">{leads.length}</span>}
            </button>
          ))}
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <span className="text-[11px] text-zinc-500">Evidence vault sync</span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#84FF3D]" />
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-[1920px] px-3 py-4 md:px-6 md:py-6">
        {loading ? (
          <div className="grid place-items-center py-32">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#0EA5FF]" />
              <div className="text-[12px] text-zinc-500 mono">Loading DOS7 vault...</div>
            </div>
          </div>
        ) : role === "user" ? (
          /* USER VIEW */
          <div className="space-y-6">
            {/* Client header */}
            <div className="glass-strong rounded-[20px] p-5 md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0EA5FF] to-[#84FF3D] text-black">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="sora text-[20px] font-semibold">Oldham MOT Centre</div>
                    <div className="text-[13px] text-zinc-400">Client portal • Vexo Garage onboarding • OL8 1JR</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-[#84FF3D]/10 px-2.5 py-1 text-[11px] font-medium text-[#84FF3D]">Project Active</span>
                      <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-zinc-400">£28k • 50% upfront paid</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black">Raise ticket</button>
                  <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-medium">Chat with Captain</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="glass rounded-[16px] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="sora text-[15px] font-semibold">My Projects</h3>
                    <span className="text-[11px] text-zinc-500">Vexo Garage OS • 76% complete</span>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-[#0EA5FF]" />
                          <span className="text-[13px] font-medium">DVSA MOT history API integration</span>
                          <span className="rounded-full bg-[#0EA5FF]/10 px-2 py-0.5 text-[10px] text-[#0EA5FF]">In Progress</span>
                        </div>
                        <span className="mono text-[11px] text-zinc-500">Due Nov 28</span>
                      </div>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                        <div className="h-full w-[68%] rounded-full bg-[#0EA5FF]" />
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-[#84FF3D]" />
                          <span className="text-[13px] font-medium">Booking widget - Class 4/7 toggle</span>
                          <span className="rounded-full bg-[#84FF3D]/10 px-2 py-0.5 text-[10px] text-[#84FF3D]">Review</span>
                        </div>
                        <span className="mono text-[11px] text-zinc-500">Due Nov 25</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[16px] p-5">
                  <h3 className="sora mb-4 text-[15px] font-semibold">My Chats with AVA / Captain</h3>
                  <div className="space-y-3">
                    {chats.slice(0, 2).map((c) => (
                      <div key={c.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-medium">{c.value.leadName}</span>
                          <span className={`text-[10px] ${c.value.sentiment === "Positive" ? "text-[#84FF3D]" : "text-amber-400"}`}>{c.value.sentiment} • Score {c.value.jobScore}</span>
                        </div>
                        <div className="mt-2 text-[12px] text-zinc-400">{c.value.lastMessage}</div>
                        <div className="mt-2 flex gap-2">
                          {c.value.transcript.slice(0, 2).map((t, i) => (
                            <div key={i} className={`rounded-lg px-2.5 py-1.5 text-[11px] ${t.from === "lead" ? "bg-white/[0.06]" : "bg-[#0EA5FF]/10 text-[#0EA5FF]"}`}>{t.text.slice(0, 60)}...</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass rounded-[16px] p-5">
                  <h3 className="sora mb-3 text-[14px] font-semibold">Invoices & Evidence</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-white/[0.04] p-3">
                      <div>
                        <div className="text-[12px] font-medium">50% Upfront • Vexo Garage</div>
                        <div className="text-[11px] text-zinc-500">INV-2025-102 • Paid via Stripe</div>
                      </div>
                      <span className="text-[12px] font-semibold text-[#84FF3D]">£14,000</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/[0.04] p-3">
                      <div>
                        <div className="text-[12px] font-medium">Discovery Evidence Bundle</div>
                        <div className="text-[11px] text-zinc-500">8 files • S3</div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-zinc-500" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[16px] bg-gradient-to-br from-[#0EA5FF]/20 to-[#84FF3D]/20 p-[1px]">
                  <div className="rounded-[15px] bg-[#0B1020] p-5">
                    <h4 className="sora text-[14px] font-semibold">Timeline until Live</h4>
                    <div className="mt-4 space-y-3">
                      {[
                        { d: "Discovery", done: true },
                        { d: "Alpha - on-site", done: true },
                        { d: "Beta - live widget", done: false },
                        { d: "Live - DOS7", done: false },
                      ].map((s) => (
                        <div key={s.d} className="flex items-center gap-3">
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${s.done ? "bg-[#84FF3D] text-black" : "bg-white/10 text-zinc-500"}`}>{s.done ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}</div>
                          <span className={`text-[12px] ${s.done ? "text-white" : "text-zinc-500"}`}>{s.d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ADMIN VIEW */
          <>
            {activeTab === "Dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <div className="glass-strong rounded-[20px] p-5 lg:col-span-8">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="sora text-[15px] font-semibold">Leads Contacted / Qualified • 12-month rolling</h3>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-[11px] text-zinc-400"><span className="h-2 w-2 rounded-full bg-[#0EA5FF]" />Contacted</span>
                        <span className="flex items-center gap-1.5 text-[11px] text-zinc-400"><span className="h-2 w-2 rounded-full bg-[#84FF3D]" />Qualified</span>
                      </div>
                    </div>
                    <div className="h-[260px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MONTHLY_LEADS}>
                          <defs>
                            <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0EA5FF" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="#0EA5FF" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#84FF3D" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="#84FF3D" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8B90A3" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#8B90A3" }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: "#0B1020", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                          <Area type="monotone" dataKey="contacted" stroke="#0EA5FF" fill="url(#c1)" strokeWidth={2} />
                          <Area type="monotone" dataKey="qualified" stroke="#84FF3D" fill="url(#c2)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4 lg:col-span-4">
                    <div className="glass rounded-[16px] p-4">
                      <h4 className="mb-3 text-[13px] font-semibold">Engagement Mix</h4>
                      <div className="h-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ENGAGEMENT_TYPES}>
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#8B90A3" }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "#0B1020", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                              {ENGAGEMENT_TYPES.map((e, i) => (
                                <Cell key={i} fill={e.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { title: "Industrial Lead List", val: "23K → 400", sub: "OL/M/SK/BL filtered", icon: Database, color: "#0EA5FF" },
                        { title: "Engagement Score", val: "8.4/10", sub: "GOV.UK aligned", icon: Award, color: "#84FF3D" },
                        { title: "Compliance Vault", val: `${vaultProgress}%`, sub: "73% → 100% DOS7", icon: ShieldCheck, color: "#FFD700" },
                        { title: "Conversion Funnel", val: "18%", sub: "Lead → Won", icon: Target, color: "#A78BFA" },
                      ].map((c) => (
                        <div key={c.title} className="glass rounded-[14px] p-3">
                          <div className="flex items-center justify-between">
                            <c.icon className="h-4 w-4" style={{ color: c.color }} />
                            <span className="text-[10px] text-zinc-500">{c.sub}</span>
                          </div>
                          <div className="mt-2 sora text-[13px] font-semibold">{c.title}</div>
                          <div className="text-[18px] font-bold" style={{ color: c.color }}>{c.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="glass rounded-[16px] p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[13px] font-semibold">Conversion Funnel</h4>
                      <span className="text-[11px] text-zinc-500">400 leads</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {[
                        { label: "Lead", pct: 100, count: 400 },
                        { label: "Contacted", pct: 62, count: 248 },
                        { label: "Qualified", pct: 28, count: 112 },
                        { label: "Proposal", pct: 12, count: 48 },
                        { label: "Won", pct: 5, count: 18 },
                      ].map((f) => (
                        <div key={f.label} className="flex items-center gap-3">
                          <span className="w-[70px] text-[11px] text-zinc-400">{f.label}</span>
                          <div className="flex-1">
                            <div className="h-2 rounded-full bg-white/10">
                              <div className="h-full rounded-full bg-gradient-to-r from-[#0EA5FF] to-[#84FF3D]" style={{ width: `${f.pct}%` }} />
                            </div>
                          </div>
                          <span className="w-[30px] text-right text-[11px] font-medium">{f.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-[16px] p-4 md:col-span-2">
                    <h4 className="mb-3 text-[13px] font-semibold">Live Evidence Feed • GOV.UK Service Standard</h4>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {engagements.slice(0, 4).map((e) => (
                        <div key={e.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                            {e.value.type === "Call" ? <Phone className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[12px] font-medium">{e.value.leadName} • {e.value.type}</div>
                            <div className="truncate text-[11px] text-zinc-500">{e.value.notes.slice(0, 48)}...</div>
                          </div>
                          <span className="rounded-full bg-[#0EA5FF]/10 px-2 py-0.5 text-[10px] text-[#0EA5FF]">{e.value.govStandard}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Leads" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search garages, postcode, phone..." className="h-9 w-[260px] rounded-full border border-white/10 bg-white/[0.04] pl-10 pr-4 text-[13px] outline-none placeholder:text-zinc-500 focus:border-[#0EA5FF]/40 md:w-[320px]" />
                    </div>
                    <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
                      {["All", "OL", "M", "SK", "BL", "Score>70"].map((f) => (
                        <button key={f} onClick={() => setFilterArea(f)} className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${filterArea === f ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleImportDVSA} disabled={importBusy} className="flex items-center gap-2 rounded-full bg-[#0EA5FF] px-4 py-2 text-[12px] font-semibold text-black hover:bg-[#0EA5FF]/90 disabled:opacity-50">
                      <Upload className="h-4 w-4" />{importBusy ? "Importing..." : "Import DVSA CSV"}
                    </button>
                    <button onClick={handleEnrich} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-medium hover:bg-white/[0.08]">
                      <Zap className="h-4 w-4" />Enrich Companies House
                    </button>
                    <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-medium">
                      <Sparkles className="h-4 w-4" />Generate Icebreakers
                    </button>
                  </div>
                </div>

                {importResult && (
                  <div className="flex items-center gap-3 rounded-xl border border-[#84FF3D]/20 bg-[#84FF3D]/10 px-4 py-3 text-[12px]">
                    <Check className="h-4 w-4 text-[#84FF3D]" />
                    <span>Imported {importResult.saved} leads, {importResult.remaining} remaining</span>
                    {importResult.error && <span className="text-amber-400">• {importResult.error}</span>}
                  </div>
                )}

                {/* Desktop table */}
                <div className="hidden overflow-hidden rounded-[16px] border border-white/[0.06] md:block">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px]">
                      <thead className="bg-white/[0.03] text-left text-[11px] uppercase tracking-widest text-zinc-500">
                        <tr>
                          <th className="px-4 py-3 font-medium">Company</th>
                          <th className="px-4 py-3 font-medium">Address / Postcode</th>
                          <th className="px-4 py-3 font-medium">MOT Classes</th>
                          <th className="px-4 py-3 font-medium">CH Status</th>
                          <th className="px-4 py-3 font-medium">Score</th>
                          <th className="px-4 py-3 font-medium">AI Icebreaker</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {filteredLeads.map((l) => (
                          <tr key={l.id} className="group hover:bg-white/[0.03]">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-[11px] font-bold">{l.value.companyName[0]}</div>
                                <div>
                                  <div className="text-[13px] font-medium">{l.value.companyName}</div>
                                  <div className="flex items-center gap-1 text-[11px] text-zinc-500"><Phone className="h-3 w-3" />{l.value.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-[12px]">{l.value.address}</div>
                              <div className="flex items-center gap-1 text-[11px] text-zinc-500"><MapPin className="h-3 w-3" />{l.value.postcode} • {l.value.postcodeArea}</div>
                            </td>
                            <td className="px-4 py-3"><span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px]">{l.value.motClasses}</span></td>
                            <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] ${l.value.companiesHouseStatus === "Active" ? "bg-[#84FF3D]/10 text-[#84FF3D]" : "bg-amber-400/10 text-amber-400"}`}>{l.value.companiesHouseStatus}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-12 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#0EA5FF]" style={{ width: `${l.value.score}%` }} /></div>
                                <span className="mono text-[12px] font-medium">{l.value.score}</span>
                              </div>
                            </td>
                            <td className="max-w-[240px] px-4 py-3"><div className="truncate text-[11px] text-zinc-400" title={l.value.aiIcebreaker}>{l.value.aiIcebreaker.slice(0, 70)}...</div></td>
                            <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] ${l.value.status === "Qualified" ? "bg-[#84FF3D]/10 text-[#84FF3D]" : l.value.status === "Contacted" ? "bg-[#0EA5FF]/10 text-[#0EA5FF]" : "bg-white/[0.06] text-zinc-400"}`}>{l.value.status}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button className="rounded-full bg-white p-1.5 text-black"><ArrowUpRight className="h-3.5 w-3.5" /></button>
                                <button className="rounded-full bg-white/[0.06] p-1.5"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile cards */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {filteredLeads.map((l) => (
                    <div key={l.id} className="glass rounded-[14px] p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[14px] font-semibold">{l.value.companyName}</div>
                          <div className="text-[11px] text-zinc-500">{l.value.postcode} • {l.value.motClasses}</div>
                        </div>
                        <span className="mono text-[12px] font-bold text-[#0EA5FF]">{l.value.score}</span>
                      </div>
                      <div className="mt-2 text-[11px] text-zinc-400">{l.value.aiIcebreaker.slice(0, 90)}...</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-[11px] text-zinc-500">
                  <span className="mono">// WIRE: Supabase table `leads` • S3 for CSV raw • Companies House API • Qwen icebreaker generation</span>
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#84FF3D]" />Live sync</span>
                </div>
              </div>
            )}

            {activeTab === "Engagement" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="sora text-[16px] font-semibold">Engagement Log • Evidence for DOS7</h3>
                    <button onClick={() => setShowEngagementModal(true)} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-black"><Plus className="h-4 w-4" />Add Engagement</button>
                  </div>
                  <div className="relative space-y-0">
                    <div className="absolute left-4 top-2 h-full w-px bg-gradient-to-b from-[#0EA5FF]/50 to-transparent md:left-6" />
                    {engagements.map((e) => (
                      <div key={e.id} className="relative flex gap-4 py-4">
                        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#0B1020] md:ml-2">
                          <div className="h-2 w-2 rounded-full bg-[#0EA5FF]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="glass rounded-[14px] p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-semibold">{e.value.leadName}</span>
                                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px]">{e.value.type}</span>
                                <span className="text-[11px] text-zinc-500">{e.value.date} • {e.value.duration}</span>
                              </div>
                              <span className="rounded-full bg-[#84FF3D]/10 px-2.5 py-1 text-[10px] font-medium text-[#84FF3D]">{e.value.govStandard}</span>
                            </div>
                            <div className="mt-2 text-[13px] text-zinc-300">{e.value.notes}</div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[11px] text-zinc-500">Outcome: <span className="text-zinc-300">{e.value.outcome}</span></span>
                              <span className="flex items-center gap-1 text-[11px] text-[#0EA5FF]"><Paperclip className="h-3 w-3" />{e.value.evidenceFile}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <div className="glass rounded-[16px] p-5">
                    <h4 className="mb-4 flex items-center gap-2 text-[13px] font-semibold"><Shield className="h-4 w-4 text-[#FFD700]" />GOV.UK Service Standard Alignment</h4>
                    <div className="space-y-3">
                      {[
                        { std: "Discovery", count: 8, pct: 100 },
                        { std: "Alpha", count: 12, pct: 100 },
                        { std: "Beta", count: 6, pct: 60 },
                        { std: "Live", count: 0, pct: 0 },
                      ].map((s) => (
                        <div key={s.std} className="flex items-center justify-between rounded-lg bg-white/[0.03] p-3">
                          <div>
                            <div className="text-[12px] font-medium">{s.std}</div>
                            <div className="text-[11px] text-zinc-500">{s.count} evidence files</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[12px] font-semibold" style={{ color: s.pct === 100 ? "#84FF3D" : s.pct === 0 ? "#8B90A3" : "#FFD700" }}>{s.pct}%</div>
                            <div className="mt-1 h-1 w-16 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#0EA5FF]" style={{ width: `${s.pct}%` }} /></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl bg-[#FFD700]/10 p-3 text-[11px] text-[#FFD700]">Each engagement auto-logs to Vault with S3 evidence link. Export bundle for DOS7 review.</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Negotiations" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="sora text-[16px] font-semibold">Negotiation Tracker • Pipeline £{Math.round(pipelineValue / 1000)}K</h3>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="rounded-full bg-white/[0.06] px-3 py-1">Total: £{Math.round(pipelineValue / 1000)}K</span>
                    <span className="rounded-full bg-[#84FF3D]/10 px-3 py-1 text-[#84FF3D]">Weighted: £{Math.round(weighted / 1000)}K</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
                  {["Lead", "Contacted", "Tech Assessment", "Proposal Sent", "Negotiation", "Won"].map((stage) => (
                    <div key={stage} className="glass rounded-[14px] p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">{stage}</span>
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px]">{negotiations.filter((n) => n.value.stage === stage).length}</span>
                      </div>
                      <div className="space-y-2">
                        {negotiations
                          .filter((n) => n.value.stage === stage)
                          .map((n) => (
                            <div key={n.id} className="rounded-xl border border-white/[0.06] bg-[#121A2E] p-3">
                              <div className="flex items-start justify-between">
                                <div className="text-[12px] font-medium leading-tight">{n.value.leadName}</div>
                                <span className="text-[11px] font-bold text-[#0EA5FF]">£{Math.round(n.value.value / 1000)}K</span>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="h-1 flex-1 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#84FF3D]" style={{ width: `${n.value.probability}%` }} /></div>
                                <span className="text-[10px] text-zinc-500">{n.value.probability}%</span>
                              </div>
                              <div className="mt-2 text-[10px] text-zinc-500">Next: {n.value.nextAction}</div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-[10px] text-zinc-600">{n.value.daysInStage}d in stage • {n.value.owner}</span>
                                <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[9px]">{n.value.retainer}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Tickets" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="sora text-[16px] font-semibold">Tickets Kanban • Project Execution</h3>
                  <button className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-black">New Ticket</button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  {(["To Do", "In Progress", "Review", "Done"] as const).map((col) => (
                    <div
                      key={col}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleTicketDrop(col)}
                      className="min-h-[420px] rounded-[16px] border border-white/[0.06] bg-[#0B1020]/50 p-3"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[12px] font-semibold uppercase tracking-widest text-zinc-400">{col}</span>
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px]">{tickets.filter((t) => t.value.column === col).length}</span>
                      </div>
                      <div className="space-y-2">
                        {tickets
                          .filter((t) => t.value.column === col)
                          .map((t) => (
                            <div
                              key={t.id}
                              draggable
                              onDragStart={() => setDragTicket(t.id)}
                              className="group cursor-grab rounded-xl border border-white/[0.06] bg-[#121A2E] p-3 shadow-sm transition hover:border-white/15 active:cursor-grabbing"
                            >
                              <div className="flex items-center justify-between">
                                <span className="mono text-[10px] text-zinc-500">{t.value.ticketId}</span>
                                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${t.value.priority === "Critical" ? "bg-red-500/20 text-red-400" : t.value.priority === "High" ? "bg-amber-400/20 text-amber-400" : "bg-white/10 text-zinc-400"}`}>{t.value.priority}</span>
                              </div>
                              <div className="mt-1 text-[12px] font-medium leading-snug">{t.value.title}</div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="rounded-full bg-[#0EA5FF]/10 px-2 py-0.5 text-[10px] text-[#0EA5FF]">{t.value.project}</span>
                                <span className="text-[10px] text-zinc-500">{t.value.assignee}</span>
                              </div>
                              <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-600">
                                <span>Due {t.value.due}</span>
                                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{t.value.client.slice(0, 12)}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Chats" && (
              <div className="grid h-[640px] grid-cols-1 gap-0 overflow-hidden rounded-[16px] border border-white/[0.06] lg:grid-cols-12">
                <div className="border-r border-white/[0.06] bg-[#0B1020] lg:col-span-4">
                  <div className="border-b border-white/[0.06] p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[13px] font-semibold">Chat Hub • AVA + Human</h4>
                      <span className="rounded-full bg-[#0EA5FF]/10 px-2 py-0.5 text-[10px] text-[#0EA5FF]">{chats.length} active</span>
                    </div>
                    <div className="mt-3 flex gap-1">
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-black">All</span>
                      <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-zinc-400">Widget</span>
                      <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-zinc-400">Contact OS</span>
                    </div>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {chats.map((c) => (
                      <button key={c.id} onClick={() => setSelectedChat(c.id)} className={`flex w-full items-start gap-3 p-3 text-left transition hover:bg-white/[0.04] ${selectedChat === c.id ? "bg-white/[0.06]" : ""}`}>
                        <div className="mt-1 h-8 w-8 rounded-full bg-gradient-to-br from-[#0EA5FF] to-[#84FF3D] p-[1px]"><div className="flex h-full w-full items-center justify-center rounded-full bg-[#0B1020] text-[11px] font-bold">{c.value.leadName[0]}</div></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-medium">{c.value.leadName}</span>
                            <span className={`text-[10px] ${c.value.sentiment === "Positive" ? "text-[#84FF3D]" : c.value.sentiment === "Negative" ? "text-red-400" : "text-zinc-500"}`}>{c.value.sentiment} • {c.value.jobScore}</span>
                          </div>
                          <div className="truncate text-[11px] text-zinc-500">{c.value.lastMessage}</div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[9px]">{c.value.origin}</span>
                            <span className="text-[9px] text-zinc-600">{c.value.techAssessment.slice(0, 30)}...</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col bg-[#0B1020]/60 lg:col-span-8">
                  {selectedChat ? (
                    <>
                      <div className="flex items-center justify-between border-b border-white/[0.06] p-3">
                        <div>
                          <div className="text-[13px] font-semibold">{chats.find((c) => c.id === selectedChat)?.value.leadName}</div>
                          <div className="text-[11px] text-zinc-500">{chats.find((c) => c.id === selectedChat)?.value.techAssessment}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="rounded-full bg-[#FFD700] px-3 py-1.5 text-[11px] font-semibold text-black">Takeover (Captain)</button>
                          <button className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px]">Log as Engagement</button>
                        </div>
                      </div>
                      <div className="flex-1 space-y-3 overflow-y-auto p-4">
                        {(chats.find((c) => c.id === selectedChat)?.value.transcript || []).map((t, i) => (
                          <div key={i} className={`flex ${t.from === "lead" ? "justify-start" : "justify-end"}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px] ${t.from === "lead" ? "bg-white/[0.06] text-white" : t.from === "ava" ? "bg-[#0EA5FF]/15 text-[#0EA5FF] border border-[#0EA5FF]/20" : "bg-[#84FF3D]/15 text-[#84FF3D]"}`}>
                              {t.text}
                              <div className="mt-1 text-[10px] opacity-60">{t.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-white/[0.06] p-3">
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                          <input placeholder="Type reply as Captain..." className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-zinc-500" />
                          <button className="rounded-full bg-white p-2 text-black"><Send className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="grid flex-1 place-items-center p-8 text-center">
                      <div>
                        <MessageSquare className="mx-auto h-8 w-8 text-zinc-600" />
                        <div className="mt-3 text-[13px] font-medium">Select a conversation</div>
                        <div className="text-[12px] text-zinc-500">AVA handles initial triage, Captain takes over on sentiment drop or high job score</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Projects" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="sora text-[16px] font-semibold">Projects • 6 OS</h3>
                  <span className="text-[11px] text-zinc-500">Guardian 8/15/25% • £49+10% model</span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {PROJECTS.map((p) => (
                    <div key={p.name} className="group glass rounded-[16px] p-5 transition hover:border-white/15">
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${p.color}18` }}><FolderGit2 className="h-5 w-5" style={{ color: p.color }} /></div>
                        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px]">{p.mrr}</span>
                      </div>
                      <div className="mt-4 sora text-[15px] font-semibold">{p.name}</div>
                      <div className="text-[12px] text-zinc-400">{p.desc}</div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[11px]"><span className="text-zinc-500">Progress</span><span className="font-medium" style={{ color: p.color }}>{p.progress}%</span></div>
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} /></div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500">{p.tickets} tickets linked</span>
                        <span className="flex items-center gap-1 font-medium" style={{ color: p.color }}>{p.billing}<ArrowUpRight className="h-3 w-3" /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Vault" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="sora text-[16px] font-semibold">Compliance Vault • DOS7 Killer</h3>
                    <button className="flex items-center gap-2 rounded-full bg-[#FFD700] px-4 py-2 text-[12px] font-bold text-black"><Download className="h-4 w-4" />Export Evidence Bundle</button>
                  </div>
                  <div className="space-y-2">
                    {COMPLIANCE_ITEMS.map((item) => (
                      <div key={item.id} className="glass flex items-center justify-between rounded-[12px] p-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.status === "Done" ? "bg-[#84FF3D]/15 text-[#84FF3D]" : item.status === "In Progress" ? "bg-[#FFD700]/15 text-[#FFD700]" : "bg-white/5 text-zinc-500"}`}>
                            {item.status === "Done" ? <Check className="h-4 w-4" /> : item.status === "In Progress" ? <Clock className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="text-[13px] font-medium">{item.title}</div>
                            <div className="text-[11px] text-zinc-500">{item.cat} • {item.evidence} files • Last {item.last}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${item.status === "Done" ? "bg-[#84FF3D]/10 text-[#84FF3D]" : item.status === "In Progress" ? "bg-[#FFD700]/10 text-[#FFD700]" : "bg-white/[0.06] text-zinc-500"}`}>{item.status}</span>
                          <button className="rounded-full bg-white/[0.06] p-1.5"><ExternalLink className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <div className="glass-strong rounded-[20px] p-6">
                    <h4 className="sora text-[15px] font-semibold">Evidence Progress</h4>
                    <div className="mt-6 flex flex-col items-center">
                      <div className="relative h-[160px] w-[160px]">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                          <circle cx="50" cy="50" r="44" fill="none" stroke="url(#goldGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${vaultProgress * 2.76} 276`} />
                          <defs>
                            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#FFD700" />
                              <stop offset="100%" stopColor="#84FF3D" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="text-center">
                            <div className="sora text-[32px] font-bold leading-none text-[#FFD700]">{vaultProgress}%</div>
                            <div className="text-[11px] text-zinc-500">→ 100%</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 grid w-full grid-cols-2 gap-3 text-[11px]">
                        <div className="rounded-xl bg-white/[0.04] p-3">
                          <div className="text-zinc-500">GOV.UK 14 points</div>
                          <div className="mt-1 text-[13px] font-semibold">9/14 Done</div>
                        </div>
                        <div className="rounded-xl bg-white/[0.04] p-3">
                          <div className="text-zinc-500">Total evidence</div>
                          <div className="mt-1 text-[13px] font-semibold">81 files • S3</div>
                        </div>
                      </div>
                      <div className="mt-4 w-full rounded-xl bg-[#0EA5FF]/10 p-3 text-[11px] text-[#0EA5FF]">Auto-animation 73% → 100% by DOS7 Day 87. Each engagement + ticket logs proof.</div>
                    </div>
                  </div>

                  <div className="mt-4 glass rounded-[14px] p-4">
                    <h5 className="text-[12px] font-semibold">Wiring Checklist</h5>
                    <div className="mt-2 space-y-1.5 text-[11px] text-zinc-500 mono">
                      <div>• S3 bucket: aikova-vault-evidence</div>
                      <div>• SES: engagement notifications</div>
                      <div>• SNS: ticket updates</div>
                      <div>• Supabase: compliance_vault table</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Billing" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <h3 className="sora mb-4 text-[16px] font-semibold">Billing & FinOps</h3>
                  <div className="overflow-hidden rounded-[16px] border border-white/[0.06]">
                    <table className="w-full">
                      <thead className="bg-white/[0.03] text-left text-[11px] uppercase tracking-widest text-zinc-500">
                        <tr><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Client / Project</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">S3</th></tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {[
                          { inv: "INV-102", client: "Oldham MOT Centre", proj: "Vexo Garage", amt: "£14,000", status: "50% upfront Paid" },
                          { inv: "INV-101", client: "Coppice MOT Centre", proj: "Vexo Garage", amt: "£9,000", status: "Paid" },
                          { inv: "INV-100", client: "VisaGuide Ltd", proj: "VisaGuide OS", amt: "£20,000", status: "Overdue" },
                          { inv: "INV-99", client: "ReelStorm Studio", proj: "ReelStorm", amt: "£18,000", status: "Paid" },
                        ].map((r) => (
                          <tr key={r.inv} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 mono text-[12px]">{r.inv}</td>
                            <td className="px-4 py-3 text-[12px]">{r.client} • <span className="text-zinc-500">{r.proj}</span></td>
                            <td className="px-4 py-3 text-[12px] font-semibold">{r.amt}</td>
                            <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] ${r.status.includes("Paid") ? "bg-[#84FF3D]/10 text-[#84FF3D]" : "bg-red-500/10 text-red-400"}`}>{r.status}</span></td>
                            <td className="px-4 py-3"><ExternalLink className="h-4 w-4 text-zinc-500" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <div className="glass rounded-[16px] p-5">
                    <h4 className="flex items-center gap-2 text-[13px] font-semibold"><BarChart3 className="h-4 w-4 text-[#0EA5FF]" />FinOps Card • AWS</h4>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between text-[12px]"><span className="text-zinc-500">Current spend</span><span className="font-medium">$1,240/mo</span></div>
                      <div className="flex justify-between text-[12px]"><span className="text-zinc-500">$50K saved pattern</span><span className="text-[#84FF3D]">-34% via Graviton + S3 IA</span></div>
                      <div className="h-1.5 w-full rounded-full bg-white/10"><div className="h-full w-[66%] rounded-full bg-[#0EA5FF]" /></div>
                      <div className="rounded-xl bg-white/[0.04] p-3 text-[11px] text-zinc-400">SES 12k emails/mo, SNS 4k pushes, S3 81 vault files, CloudFront 2.4TB. All wired to app.aikova.co.uk</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Engagement Modal */}
      {showEngagementModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-[520px] rounded-[20px] p-6">
            <div className="flex items-center justify-between">
              <h3 className="sora text-[16px] font-semibold">Add Engagement • Evidence for DOS7</h3>
              <button onClick={() => setShowEngagementModal(false)} className="rounded-full bg-white/[0.06] p-2"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-zinc-500">Lead</label>
                <select value={newEng.leadName || ""} onChange={(e) => setNewEng({ ...newEng, leadName: e.target.value })} className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13px] outline-none">
                  <option className="bg-[#0B1020]">Select lead</option>
                  {leads.slice(0, 8).map((l) => (
                    <option key={l.id} className="bg-[#0B1020]">{l.value.companyName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-zinc-500">Type</label>
                  <select value={newEng.type} onChange={(e) => setNewEng({ ...newEng, type: e.target.value as any })} className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13px] outline-none">
                    <option className="bg-[#0B1020]">Call</option><option className="bg-[#0B1020]">Meeting</option><option className="bg-[#0B1020]">Email</option><option className="bg-[#0B1020]">AVA Chat</option><option className="bg-[#0B1020]">Site Visit</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-zinc-500">GOV.UK Standard</label>
                  <select value={newEng.govStandard} onChange={(e) => setNewEng({ ...newEng, govStandard: e.target.value })} className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13px] outline-none">
                    <option className="bg-[#0B1020]">Discovery</option><option className="bg-[#0B1020]">Alpha</option><option className="bg-[#0B1020]">Beta</option><option className="bg-[#0B1020]">Live</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-zinc-500">Notes</label>
                <textarea value={newEng.notes || ""} onChange={(e) => setNewEng({ ...newEng, notes: e.target.value })} placeholder="Discovery call - booking pain, 40% no-shows..." className="mt-1 min-h-[80px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] outline-none placeholder:text-zinc-600" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-zinc-500">Outcome</label>
                <input value={newEng.outcome || ""} onChange={(e) => setNewEng({ ...newEng, outcome: e.target.value })} placeholder="Qualified - Tech Assessment booked" className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13px] outline-none placeholder:text-zinc-600" />
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-[12px] text-zinc-500">
                <Paperclip className="h-4 w-4" /> Upload evidence → S3 aikova-vault-evidence • Auto-logs to vault
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowEngagementModal(false)} className="rounded-full border border-white/10 px-5 py-2.5 text-[13px]">Cancel</button>
                <button onClick={handleCreateEngagement} className="rounded-full bg-white px-6 py-2.5 text-[13px] font-semibold text-black">Save + Vault Sync</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/[0.06] py-4 text-center text-[11px] text-zinc-600">
        <span className="mono">AiKOVA DOS7 Evidence Vault • app.aikova.co.uk • Wire: Supabase (leads, engagements, tickets, chats, compliance_vault) • S3 • SES/SNS • Companies House • DVSA CSV • Linear + Stripe + Intercom grade</span>
      </footer>
    </div>
  );
}
