import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Bell,
  Bot,
  CheckCircle,
  ChevronRight,
  CloudRain,
  Droplets,
  Info,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Minus,
  Phone,
  Plus,
  Send,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  Star,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const HOURLY_USAGE = [
  { time: "00:00", usage: 12 },
  { time: "02:00", usage: 8 },
  { time: "04:00", usage: 5 },
  { time: "06:00", usage: 18 },
  { time: "08:00", usage: 35 },
  { time: "10:00", usage: 28 },
  { time: "12:00", usage: 42 },
  { time: "14:00", usage: 30 },
  { time: "16:00", usage: 25 },
  { time: "18:00", usage: 38 },
  { time: "20:00", usage: 22 },
  { time: "22:00", usage: 14 },
];

const DAILY_FLOW = [
  { day: "Mon", flow: 145, usage: 210 },
  { day: "Tue", flow: 162, usage: 195 },
  { day: "Wed", flow: 138, usage: 225 },
  { day: "Thu", flow: 175, usage: 240 },
  { day: "Fri", flow: 153, usage: 200 },
  { day: "Sat", flow: 130, usage: 185 },
  { day: "Sun", flow: 120, usage: 170 },
];

const WEEKLY_FLOW = [
  { week: "W1", flow: 980, usage: 1420 },
  { week: "W2", flow: 1050, usage: 1380 },
  { week: "W3", flow: 920, usage: 1510 },
  { week: "W4", flow: 1100, usage: 1460 },
];

const MONTHLY_FLOW = [
  { month: "Sep", flow: 4200, usage: 6100 },
  { month: "Oct", flow: 3900, usage: 5800 },
  { month: "Nov", flow: 4500, usage: 6400 },
  { month: "Dec", flow: 4100, usage: 6000 },
  { month: "Jan", flow: 3800, usage: 5600 },
  { month: "Feb", flow: 4300, usage: 6200 },
];

const PH_TREND = [
  { time: "06:00", ph: 7.1 },
  { time: "09:00", ph: 7.3 },
  { time: "12:00", ph: 7.2 },
  { time: "15:00", ph: 7.4 },
  { time: "18:00", ph: 7.2 },
  { time: "21:00", ph: 7.1 },
];

const RAIN_HISTORY = [
  { day: "Mon", rain: 0 },
  { day: "Tue", rain: 12 },
  { day: "Wed", rain: 5 },
  { day: "Thu", rain: 0 },
  { day: "Fri", rain: 22 },
  { day: "Sat", rain: 8 },
  { day: "Sun", rain: 0 },
];

const WEATHER_FORECAST = [
  { day: "Today", icon: "☁️", temp: "28°C", rain: "20%", desc: "Partly Cloudy" },
  { day: "Tue", icon: "🌧️", temp: "24°C", rain: "80%", desc: "Heavy Rain" },
  { day: "Wed", icon: "⛈️", temp: "22°C", rain: "90%", desc: "Thunderstorm" },
  { day: "Thu", icon: "🌤️", temp: "27°C", rain: "15%", desc: "Mostly Sunny" },
  { day: "Fri", icon: "☀️", temp: "31°C", rain: "5%", desc: "Clear" },
];

const INITIAL_VALVES = [
  { name: "Main Inlet", open: true, lastChanged: "2 min ago" },
  { name: "Distribution", open: true, lastChanged: "15 min ago" },
  { name: "Irrigation", open: false, lastChanged: "1 hr ago" },
  { name: "Emergency Shutoff", open: false, lastChanged: "3 days ago" },
  { name: "Overflow", open: false, lastChanged: "5 days ago" },
  { name: "Garden", open: true, lastChanged: "30 min ago" },
];

const VALVE_LOG = [
  { valve: "Main Inlet", action: "Opened", time: "10:32 AM", user: "Auto" },
  { valve: "Garden", action: "Opened", time: "09:45 AM", user: "Admin" },
  { valve: "Irrigation", action: "Closed", time: "08:00 AM", user: "Schedule" },
  { valve: "Distribution", action: "Opened", time: "07:15 AM", user: "Admin" },
  { valve: "Overflow", action: "Closed", time: "Yesterday", user: "Auto" },
];

const MOCK_ALERTS = [
  {
    id: 1,
    severity: "high" as const,
    message: "Pressure drop detected in Main Inlet pipeline",
    time: "5 min ago",
    acknowledged: false,
  },
  {
    id: 2,
    severity: "medium" as const,
    message: "pH level slightly elevated — 7.8 (threshold: 7.5)",
    time: "1 hr ago",
    acknowledged: false,
  },
  {
    id: 3,
    severity: "low" as const,
    message: "Scheduled maintenance due for Overflow valve",
    time: "3 hrs ago",
    acknowledged: true,
  },
  {
    id: 4,
    severity: "high" as const,
    message: "Unusual flow rate spike in Distribution zone",
    time: "Yesterday",
    acknowledged: false,
  },
  {
    id: 5,
    severity: "medium" as const,
    message: "Rain forecast: consider pre-filling reservoir",
    time: "Yesterday",
    acknowledged: true,
  },
];

const TECHNICIANS = [
  {
    name: "Carlos Mendez",
    rating: 4.9,
    jobs: 128,
    phone: "+1-555-0101",
    speciality: "Tank Cleaning & Inspection",
  },
  {
    name: "Priya Sharma",
    rating: 4.8,
    jobs: 97,
    phone: "+1-555-0202",
    speciality: "Water Quality Testing",
  },
  {
    name: "James Okafor",
    rating: 4.7,
    jobs: 85,
    phone: "+1-555-0303",
    speciality: "Pipe & Valve Repair",
  },
];

const SHOP_PRODUCTS = [
  {
    id: 1,
    name: "Water Filter Cartridge",
    price: 29,
    category: "Filtration",
    desc: "3-stage activated carbon filter, 6-month lifespan",
    img: "/assets/generated/shop-water-filter.dim_400x300.png",
  },
  {
    id: 2,
    name: "Smart pH Sensor",
    price: 89,
    category: "Sensors",
    desc: "Bluetooth-enabled, ±0.01 pH accuracy",
    img: "/assets/generated/shop-ph-sensor.dim_400x300.png",
  },
  {
    id: 3,
    name: "Flow Meter",
    price: 65,
    category: "Monitoring",
    desc: "Digital display, 0.3–10 L/min range",
    img: "/assets/generated/shop-flow-meter.dim_400x300.png",
  },
  {
    id: 4,
    name: "Pressure Gauge",
    price: 45,
    category: "Monitoring",
    desc: "Stainless steel, 0–10 bar range",
    img: "/assets/generated/shop-pressure-gauge.dim_400x300.png",
  },
  {
    id: 5,
    name: "UV Purifier",
    price: 149,
    category: "Purification",
    desc: "Kills 99.99% of pathogens, 12W UV lamp",
    img: "/assets/generated/shop-uv-purifier.dim_400x300.png",
  },
  {
    id: 6,
    name: "Auto Valve Controller",
    price: 199,
    category: "Automation",
    desc: "Wi-Fi, programmable schedules, leak detection",
    img: "/assets/generated/shop-valve-controller.dim_400x300.png",
  },
];

const AI_SUGGESTIONS = [
  "Check water quality status",
  "Optimize valve schedule",
  "Rainfall forecast impact",
  "Maintenance recommendations",
  "Daily usage summary",
];

const AI_RESPONSES: Record<string, string> = {
  "Check water quality status":
    "Current water quality is within acceptable parameters. pH: 7.2 (optimal 6.5–8.5), Turbidity: 1.8 NTU (excellent below 4 NTU), TDS: 142 ppm (good below 500 ppm), Chlorine: 0.8 mg/L (safe 0.2–4 mg/L). No immediate action required.",
  "Optimize valve schedule":
    "Based on your usage patterns, I recommend: open Irrigation valve at 6 AM and 6 PM for 30 min each. Close Garden valve between 10 AM–4 PM to reduce midday evaporation. This could save approximately 18% water daily.",
  "Rainfall forecast impact":
    "Heavy rainfall expected Tuesday–Wednesday (80–90% probability). Recommend: Pre-fill reservoir to 90% capacity today, enable Auto Rain Protection to close irrigation valves, and check Overflow valve is operational.",
  "Maintenance recommendations":
    "Upcoming maintenance tasks: Replace filter cartridge (due in 12 days), inspect Overflow valve seal (last checked 5 days ago), calibrate pH sensor (monthly calibration due tomorrow). Schedule a cleaning service within 2 weeks.",
  "Daily usage summary":
    "Today's usage: 142 liters (avg 180 L/day — 21% below average). Peak consumption at 12:00 PM (42 L/hr). Tank level: 73%. Estimated full depletion without refill: 4.2 days at current rate.",
};

type Page =
  | "login"
  | "dashboard"
  | "monitor"
  | "weather"
  | "valves"
  | "analytics"
  | "alerts"
  | "services"
  | "shop"
  | "ai"
  | "profile";
type AlertSeverity = "high" | "medium" | "low";
type CartItem = { id: number; name: string; price: number; qty: number };

// ─── Circular Gauge ───────────────────────────────────────────────────────────
function CircularGauge({
  value,
  max = 100,
  size = 160,
  label,
  unit = "%",
  color = "#22B8A6",
}: {
  value: number;
  max?: number;
  size?: number;
  label?: string;
  unit?: string;
  color?: string;
}) {
  const pct = Math.min(value / max, 1);
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const gap = circ - dash;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        role="img"
        aria-label={label || "gauge"}
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={12}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
        />
        <text
          x={size / 2}
          y={size / 2 + 6}
          textAnchor="middle"
          style={{
            transform: `rotate(90deg) translate(0px, -${size}px)`,
            fill: "#0B3F4A",
            fontSize: size > 130 ? 22 : 16,
            fontWeight: 700,
            transformOrigin: `${size / 2}px ${size / 2}px`,
          }}
        >
          {value}
          {unit}
        </text>
        {label && (
          <text
            x={size / 2}
            y={size / 2 + 22}
            textAnchor="middle"
            style={{
              transform: `rotate(90deg) translate(0px, -${size}px)`,
              fill: "#64748b",
              fontSize: 11,
              transformOrigin: `${size / 2}px ${size / 2}px`,
            }}
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}

// ─── Ad Banner ────────────────────────────────────────────────────────────────
function AdBanner() {
  return (
    <div
      data-ocid="ad.banner"
      className="rounded-xl p-4 flex items-center justify-between gap-4"
      style={{
        background: "linear-gradient(135deg, #0B3F4A 0%, #0F7F84 100%)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">🌊</span>
        <div>
          <p className="text-white font-semibold text-sm">
            Upgrade to Hydro-Tech Pro
          </p>
          <p className="text-cyan-200 text-xs">
            Advanced analytics, unlimited sensors &amp; priority support
          </p>
        </div>
      </div>
      <Button size="sm" variant="secondary" className="shrink-0 text-xs">
        Learn More <ChevronRight className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({
  onLogin,
}: { onLogin: (webId: string, name: string, email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [webId, setWebId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!webId.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields: Web ID, Email, and Password");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    onLogin(webId, "Admin", email);
    toast.success("Welcome to Hydro-Tech!");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #0B3F4A 0%, #0F7F84 60%, #22B8A6 100%)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/assets/uploads/chatgpt_image_mar_28_2026_07_53_09_pm-019d38d4-c150-7469-ab36-5a279995318e-1.png"
            alt="Hydro-Tech Logo"
            className="w-16 h-16 rounded-xl object-cover mb-3"
          />
          <h1 className="text-2xl font-bold text-[#0B3F4A]">Hydro-Tech</h1>
          <p className="text-slate-500 text-sm">Smart Water Management</p>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="webId">Web ID</Label>
            <Input
              id="webId"
              data-ocid="login.input"
              required
              placeholder="Your custom web identifier"
              value={webId}
              onChange={(e) => setWebId(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="admin@hydrotech.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            data-ocid="login.submit_button"
            className="w-full"
            style={{ background: "#0F7F84" }}
            onClick={() => handleLogin()}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── ProfileSetupPage ─────────────────────────────────────────────────────────
function ProfileSetupPage({
  onComplete,
  onLogout,
}: {
  onComplete: (data: {
    name: string;
    phone: string;
    location: string;
  }) => void;
  onLogout: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !location.trim()) {
      setError(
        "All fields are required. Please fill in your details to continue.",
      );
      return;
    }
    setError("");
    onComplete({ name, phone, location });
    toast.success("Profile saved! Welcome to Hydro-Tech.");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #0B3F4A 0%, #0F7F84 60%, #22B8A6 100%)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/assets/uploads/chatgpt_image_mar_28_2026_07_53_09_pm-019d38d4-c150-7469-ab36-5a279995318e-1.png"
            alt="Hydro-Tech Logo"
            className="w-16 h-16 rounded-xl object-cover mb-3"
          />
          <h1 className="text-2xl font-bold text-[#0B3F4A]">
            Complete Your Profile
          </h1>
          <p className="text-slate-500 text-sm">
            Fill in your details to continue
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="profile-name">Full Name</Label>
            <Input
              id="profile-name"
              data-ocid="profile_setup.input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="profile-phone">Phone Number</Label>
            <Input
              id="profile-phone"
              data-ocid="profile_setup.phone_input"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="profile-location">Location</Label>
            <Input
              id="profile-location"
              data-ocid="profile_setup.location_input"
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          {error && (
            <p
              data-ocid="profile_setup.error_state"
              className="text-sm text-red-500 text-center"
            >
              {error}
            </p>
          )}
          <Button
            data-ocid="profile_setup.submit_button"
            className="w-full"
            style={{ background: "#0F7F84" }}
            onClick={handleSubmit}
          >
            Continue
          </Button>
          <div className="text-center">
            <button
              type="button"
              data-ocid="profile_setup.cancel_button"
              onClick={onLogout}
              className="text-slate-400 text-sm hover:text-[#0F7F84] underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ onNav }: { onNav: (p: Page) => void }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0B3F4A]">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "pH Level",
            value: "7.2",
            unit: "",
            icon: "🧪",
            color: "#22B8A6",
            good: true,
          },
          {
            label: "Turbidity",
            value: "1.8",
            unit: " NTU",
            icon: "💧",
            color: "#0F7F84",
            good: true,
          },
          {
            label: "Daily Usage",
            value: "142",
            unit: " L",
            icon: "📊",
            color: "#0B3F4A",
            good: true,
          },
          {
            label: "Active Valves",
            value: "3",
            unit: "/6",
            icon: "🔧",
            color: "#14A086",
            good: true,
          },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                    <span className="text-sm font-normal text-slate-400">
                      {stat.unit}
                    </span>
                  </p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <Badge
                className="mt-2 text-xs"
                style={{ background: "#dcfce7", color: "#166534" }}
              >
                Normal
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card flex flex-col items-center py-6">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-base text-[#0B3F4A]">
              Tank Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CircularGauge
              value={73}
              size={160}
              label="73% Full"
              color="#0F7F84"
            />
            <p className="text-center text-sm text-slate-500 mt-2">
              ~4.2 days remaining
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#0B3F4A]">
              Today's Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {WEATHER_FORECAST.map((w) => (
                <div
                  key={w.day}
                  className="flex flex-col items-center min-w-[70px] bg-slate-50 rounded-xl p-2"
                >
                  <span className="text-xs text-slate-500">{w.day}</span>
                  <span className="text-2xl my-1">{w.icon}</span>
                  <span className="text-sm font-semibold">{w.temp}</span>
                  <span className="text-xs text-blue-500">💧{w.rain}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#0B3F4A]">
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_ALERTS.filter((a) => !a.acknowledged)
              .slice(0, 3)
              .map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50"
                >
                  <AlertTriangle
                    className="h-4 w-4 shrink-0"
                    style={{
                      color:
                        a.severity === "high"
                          ? "#ef4444"
                          : a.severity === "medium"
                            ? "#f59e0b"
                            : "#22c55e",
                    }}
                  />
                  <p className="text-xs text-slate-700 line-clamp-1">
                    {a.message}
                  </p>
                </div>
              ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => onNav("alerts")}
              data-ocid="dashboard.alerts.button"
            >
              View all alerts <ChevronRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#0B3F4A]">
              Hourly Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={HOURLY_USAGE}>
                <defs>
                  <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22B8A6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 9 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#22B8A6"
                  fill="url(#dg1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <AdBanner />
    </div>
  );
}

// ─── Water Monitor ────────────────────────────────────────────────────────────
function WaterMonitor() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0B3F4A]">Water Monitor</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-card flex flex-col items-center py-6">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-base text-[#0B3F4A]">
              Tank Level
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CircularGauge value={73} size={180} color="#0F7F84" />
            <div className="mt-4 space-y-1 w-full">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Capacity</span>
                <span className="font-medium text-slate-700">5,000 L</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Current</span>
                <span className="font-medium text-slate-700">3,650 L</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Inflow</span>
                <span className="font-medium text-green-600">+8.2 L/min</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Outflow</span>
                <span className="font-medium text-red-500">-5.6 L/min</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {[
            {
              label: "pH Level",
              value: "7.2",
              unit: "",
              ideal: "6.5–8.5",
              icon: "🧪",
              ok: true,
            },
            {
              label: "Turbidity",
              value: "1.8",
              unit: " NTU",
              ideal: "< 4 NTU",
              icon: "🌫️",
              ok: true,
            },
            {
              label: "TDS",
              value: "142",
              unit: " ppm",
              ideal: "< 500 ppm",
              icon: "💎",
              ok: true,
            },
            {
              label: "Chlorine",
              value: "0.8",
              unit: " mg/L",
              ideal: "0.2–4 mg/L",
              icon: "⚗️",
              ok: true,
            },
          ].map((q) => (
            <Card key={q.label} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <span className="text-xl">{q.icon}</span>
                  <Badge
                    style={{ background: "#dcfce7", color: "#166534" }}
                    className="text-xs"
                  >
                    OK
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-[#0B3F4A] mt-2">
                  {q.value}
                  <span className="text-sm font-normal text-slate-400">
                    {q.unit}
                  </span>
                </p>
                <p className="text-xs text-slate-500">{q.label}</p>
                <p className="text-xs text-slate-400 mt-1">Ideal: {q.ideal}</p>
                <Progress
                  value={
                    q.label === "pH Level"
                      ? 72
                      : q.label === "Turbidity"
                        ? 45
                        : q.label === "TDS"
                          ? 28
                          : 20
                  }
                  className="h-1 mt-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0B3F4A]">
            Hourly Usage Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={HOURLY_USAGE}>
              <defs>
                <linearGradient id="ug1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22B8A6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="usage"
                name="Usage (L)"
                stroke="#22B8A6"
                fill="url(#ug1)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Weather & Rain ───────────────────────────────────────────────────────────
function WeatherRain() {
  const [autoProtect, setAutoProtect] = useState(true);
  const rainRisk = 80;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0B3F4A]">
        Weather &amp; Rain Protection
      </h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="shadow-card md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#0B3F4A]">
              5-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex overflow-x-auto gap-3 pb-1">
              {WEATHER_FORECAST.map((w) => (
                <div
                  key={w.day}
                  className={`flex flex-col items-center p-3 rounded-xl shrink-0 min-w-[80px] ${w.day === "Today" ? "bg-[#0B3F4A] text-white" : "bg-slate-50"}`}
                >
                  <span
                    className={`text-xs font-medium ${w.day === "Today" ? "text-cyan-200" : "text-slate-500"}`}
                  >
                    {w.day}
                  </span>
                  <span className="text-3xl my-2">{w.icon}</span>
                  <span
                    className={`text-sm font-bold ${w.day === "Today" ? "text-white" : "text-slate-700"}`}
                  >
                    {w.temp}
                  </span>
                  <span
                    className={`text-xs mt-1 ${w.day === "Today" ? "text-cyan-300" : "text-blue-500"}`}
                  >
                    💧 {w.rain}
                  </span>
                  <span
                    className={`text-xs mt-1 text-center leading-tight ${w.day === "Today" ? "text-cyan-200" : "text-slate-400"}`}
                  >
                    {w.desc}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-slate-600 mb-2">
                Current Rainfall Risk
              </p>
              <div className="flex items-center gap-3">
                <CircularGauge
                  value={rainRisk}
                  size={90}
                  color={
                    rainRisk > 70
                      ? "#ef4444"
                      : rainRisk > 40
                        ? "#f59e0b"
                        : "#22c55e"
                  }
                  unit="%"
                />
                <div>
                  <Badge style={{ background: "#fee2e2", color: "#991b1b" }}>
                    High Risk
                  </Badge>
                  <p className="text-xs text-slate-500 mt-1">
                    Heavy rain expected Tue–Wed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Auto Rain Protection
                  </p>
                  <p className="text-xs text-slate-400">
                    Close irrigation valves on rain
                  </p>
                </div>
                <Switch
                  data-ocid="weather.toggle"
                  checked={autoProtect}
                  onCheckedChange={(v) => {
                    setAutoProtect(v);
                    toast.success(
                      v
                        ? "Auto protection enabled"
                        : "Auto protection disabled",
                    );
                  }}
                />
              </div>
              {autoProtect && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Active — will trigger at
                  60% rain probability
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0B3F4A]">
            Rain History (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={RAIN_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="rain"
                name="Rainfall (mm)"
                fill="#0F7F84"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Valve Control ────────────────────────────────────────────────────────────
function ValveControl() {
  const [valves, setValves] = useState(INITIAL_VALVES);
  const { actor } = useActor();

  const toggle = (idx: number) => {
    setValves((prev) =>
      prev.map((v, i) =>
        i === idx ? { ...v, open: !v.open, lastChanged: "just now" } : v,
      ),
    );
    toast.success(
      `${valves[idx].name} ${valves[idx].open ? "closed" : "opened"}`,
    );
  };
  const openAll = () => {
    setValves((prev) =>
      prev.map((v) => ({ ...v, open: true, lastChanged: "just now" })),
    );
    toast.success("All valves opened");
  };
  const closeAll = () => {
    setValves((prev) =>
      prev.map((v) => ({ ...v, open: false, lastChanged: "just now" })),
    );
    toast.success("All valves closed");
  };

  const saveToBackend = async () => {
    if (!actor) {
      toast.error("Not connected");
      return;
    }
    try {
      await actor.persistValveState(valves.map((v) => [v.name, v.open]));
      toast.success("Valve states saved");
    } catch {
      toast.error("Failed to save valve states");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0B3F4A]">Valve Control</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            data-ocid="valves.open_all.button"
            onClick={openAll}
            style={{ background: "#22B8A6", color: "white" }}
          >
            Open All
          </Button>
          <Button
            size="sm"
            variant="outline"
            data-ocid="valves.close_all.button"
            onClick={closeAll}
          >
            Close All
          </Button>
          <Button
            size="sm"
            variant="ghost"
            data-ocid="valves.save.button"
            onClick={saveToBackend}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {valves.map((valve, i) => (
          <Card
            key={valve.name}
            className={`shadow-card border-l-4 ${valve.open ? "border-l-[#22B8A6]" : "border-l-slate-300"}`}
            data-ocid={`valves.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-slate-700">
                    {valve.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    Changed: {valve.lastChanged}
                  </p>
                </div>
                <Switch
                  data-ocid={`valves.toggle.${i + 1}`}
                  checked={valve.open}
                  onCheckedChange={() => toggle(i)}
                />
              </div>
              <Badge
                className="mt-2"
                style={{
                  background: valve.open ? "#dcfce7" : "#f1f5f9",
                  color: valve.open ? "#166534" : "#64748b",
                }}
              >
                {valve.open ? "Open" : "Closed"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0B3F4A]">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {VALVE_LOG.map((log, i) => (
              <div
                key={`${log.valve}-${i}`}
                className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 text-sm"
                data-ocid={`valves.log.item.${i + 1}`}
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${log.action === "Opened" ? "bg-green-500" : "bg-slate-400"}`}
                />
                <span className="font-medium text-slate-700">{log.valve}</span>
                <span className="text-slate-500">{log.action}</span>
                <span className="ml-auto text-xs text-slate-400">
                  {log.time}
                </span>
                <Badge variant="outline" className="text-xs">
                  {log.user}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────────
function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0B3F4A]">Analytics</h1>
      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily" data-ocid="analytics.daily.tab">
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" data-ocid="analytics.weekly.tab">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" data-ocid="analytics.monthly.tab">
            Monthly
          </TabsTrigger>
        </TabsList>
        {(["daily", "weekly", "monthly"] as const).map((period) => {
          const data =
            period === "daily"
              ? DAILY_FLOW
              : period === "weekly"
                ? WEEKLY_FLOW
                : MONTHLY_FLOW;
          const key =
            period === "daily" ? "day" : period === "weekly" ? "week" : "month";
          return (
            <TabsContent key={period} value={period} className="space-y-4">
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-[#0B3F4A]">
                    Flow Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#0F7F84"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#0F7F84"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey={key} tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="flow"
                        name="Flow (L)"
                        stroke="#0F7F84"
                        fill="url(#fg1)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-[#0B3F4A]">
                    Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey={key} tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar
                        dataKey="usage"
                        name="Usage (L)"
                        fill="#22B8A6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-[#0B3F4A]">
                    pH Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={PH_TREND}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis domain={[6.5, 8]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="ph"
                        name="pH"
                        stroke="#0B3F4A"
                        strokeWidth={2}
                        dot={{ fill: "#0B3F4A" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

// ─── Alerts ───────────────────────────────────────────────────────────────────
function Alerts() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [filter, setFilter] = useState<"all" | AlertSeverity>("all");
  const { actor } = useActor();

  const acknowledge = async (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    );
    if (actor) {
      try {
        await actor.acknowledgeAlert(BigInt(id));
      } catch {
        /* silent */
      }
    }
    toast.success("Alert acknowledged");
  };

  const filtered =
    filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0B3F4A]">Alerts</h1>
      <div className="flex gap-2 flex-wrap" data-ocid="alerts.filter.tab">
        {(["all", "high", "medium", "low"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            style={filter === f ? { background: "#0F7F84" } : {}}
            onClick={() => setFilter(f)}
            data-ocid={`alerts.${f}.button`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((a, i) => (
          <Card
            key={a.id}
            className={`shadow-card ${a.acknowledged ? "opacity-60" : ""}`}
            data-ocid={`alerts.item.${i + 1}`}
          >
            <CardContent className="p-4 flex items-center gap-3">
              {a.severity === "high" ? (
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              ) : a.severity === "medium" ? (
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
              ) : (
                <Info className="h-5 w-5 text-blue-500 shrink-0" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm text-slate-700 ${a.acknowledged ? "line-through text-slate-400" : ""}`}
                >
                  {a.message}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  style={{
                    background:
                      a.severity === "high"
                        ? "#fee2e2"
                        : a.severity === "medium"
                          ? "#fef3c7"
                          : "#dcfce7",
                    color:
                      a.severity === "high"
                        ? "#991b1b"
                        : a.severity === "medium"
                          ? "#92400e"
                          : "#166534",
                  }}
                >
                  {a.severity}
                </Badge>
                {!a.acknowledged && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    data-ocid={`alerts.acknowledge.button.${i + 1}`}
                    onClick={() => acknowledge(a.id)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" /> Ack
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [tech, setTech] = useState("");
  const [loading, setLoading] = useState(false);
  const { actor } = useActor();

  const submit = async () => {
    if (!name || !phone || !date) {
      toast.error("Please fill required fields");
      return;
    }
    setLoading(true);
    try {
      if (actor) {
        await actor.addPersistentServiceBooking({
          technicianName: tech || TECHNICIANS[0].name,
          bookingDate: BigInt(new Date(date).getTime()),
          notes,
        });
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }
      toast.success("Booking confirmed! Technician will contact you shortly.");
      setName("");
      setPhone("");
      setDate("");
      setNotes("");
      setTech("");
    } catch {
      toast.error("Booking failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0B3F4A]">
        Tank Cleaning Services
      </h1>
      <div className="grid md:grid-cols-3 gap-4">
        {TECHNICIANS.map((t, i) => (
          <Card
            key={t.name}
            className={`shadow-card cursor-pointer transition-all ${tech === t.name ? "ring-2 ring-[#22B8A6]" : ""}`}
            onClick={() => setTech(t.name)}
            data-ocid={`services.technician.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F7F84] to-[#22B8A6] flex items-center justify-center text-white text-lg font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-700">
                    {t.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-500">
                      {t.rating} · {t.jobs} jobs
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-3">{t.speciality}</p>
              <a href={`tel:${t.phone}`} onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  className="w-full"
                  style={{ background: "#0F7F84" }}
                  data-ocid={`services.call.button.${i + 1}`}
                >
                  <Phone className="h-3 w-3 mr-1" /> Call Now
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0B3F4A]">
            Book a Cleaning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Your Name *</Label>
              <Input
                data-ocid="services.name.input"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input
                data-ocid="services.phone.input"
                placeholder="+1 555-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label>Preferred Date *</Label>
              <Input
                data-ocid="services.date.input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Technician</Label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                data-ocid="services.technician.select"
                value={tech}
                onChange={(e) => setTech(e.target.value)}
              >
                <option value="">Select technician...</option>
                {TECHNICIANS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              data-ocid="services.notes.textarea"
              placeholder="Describe your tank, location, special requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <Button
            data-ocid="services.book.submit_button"
            onClick={submit}
            disabled={loading}
            style={{ background: "#0F7F84" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Shop ─────────────────────────────────────────────────────────────────────
function Shop() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const { actor } = useActor();

  const addToCart = (p: (typeof SHOP_PRODUCTS)[0]) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === p.id);
      if (ex)
        return prev.map((c) => (c.id === p.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
    toast.success(`${p.name} added to cart`);
  };

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((c) => c.id !== id));
  const updateQty = (id: number, delta: number) =>
    setCart((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c,
      ),
    );

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const checkout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);
    try {
      if (actor) {
        await Promise.all(
          cart.map((c) =>
            actor.submitPersistentShopOrder({
              productName: c.name,
              quantity: BigInt(c.qty),
              price: BigInt(c.price),
            }),
          ),
        );
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
      toast.success("Order placed successfully! 🎉");
      setCart([]);
      setCartOpen(false);
    } catch {
      toast.error("Checkout failed. Try again.");
    }
    setCheckingOut(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0B3F4A]">Shop</h1>
        <Button
          variant="outline"
          className="relative"
          onClick={() => setCartOpen(true)}
          data-ocid="shop.cart.button"
        >
          <ShoppingCart className="h-4 w-4 mr-2" /> Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#22B8A6] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SHOP_PRODUCTS.map((p, i) => (
          <Card
            key={p.id}
            className="shadow-card"
            data-ocid={`shop.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="w-full h-36 rounded-lg overflow-hidden bg-slate-100 mb-3">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <Badge variant="outline" className="text-xs mb-2">
                {p.category}
              </Badge>
              <p className="font-semibold text-sm text-slate-700">{p.name}</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">{p.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#0F7F84]">
                  ${p.price}
                </span>
                <Button
                  size="sm"
                  style={{ background: "#0F7F84" }}
                  onClick={() => addToCart(p)}
                  data-ocid={`shop.add_to_cart.button.${i + 1}`}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-80 sm:w-96" data-ocid="shop.cart.sheet">
          <SheetHeader>
            <SheetTitle>Cart ({cartCount} items)</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 mt-4 pr-1">
              {cart.length === 0 ? (
                <div
                  className="text-center py-12 text-slate-400"
                  data-ocid="shop.cart.empty_state"
                >
                  <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                      data-ocid={`shop.cart.item.${i + 1}`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          ${item.price} each
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          onClick={() => updateQty(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-6 text-center">
                          {item.qty}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          onClick={() => updateQty(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-400"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            {cart.length > 0 && (
              <div className="border-t pt-4 mt-4 space-y-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
                <Button
                  className="w-full"
                  style={{ background: "#0F7F84" }}
                  onClick={checkout}
                  disabled={checkingOut}
                  data-ocid="shop.checkout.button"
                >
                  {checkingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {checkingOut ? "Processing..." : "Checkout"}
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── AI Assistant ─────────────────────────────────────────────────────────────
function AIAssistant() {
  const [messages, setMessages] = useState<
    { from: "user" | "ai"; text: string; id: number }[]
  >([
    {
      from: "ai",
      text: "Hello! I'm your Hydro-Tech AI assistant. I can help you monitor water quality, optimize valve schedules, and prepare for weather events. What would you like to know?",
      id: 0,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text, id: prev.length }]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const response =
      AI_RESPONSES[text] ||
      "I'm analyzing your water system data... Based on current readings, everything is operating within normal parameters. pH: 7.2, Tank: 73%, 3 valves active. No immediate action required. Would you like a detailed report?";
    setMessages((prev) => [
      ...prev,
      { from: "ai", text: response, id: prev.length },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h1 className="text-2xl font-bold text-[#0B3F4A]">AI Assistant</h1>
      <Card
        className="shadow-card flex-1 flex flex-col"
        style={{ minHeight: 400 }}
      >
        <CardContent className="flex flex-col h-full p-4">
          <ScrollArea className="flex-1 pr-2" style={{ height: 380 }}>
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      m.from === "user"
                        ? "bg-[#0F7F84] text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-700 rounded-bl-sm"
                    }`}
                  >
                    {m.from === "ai" && (
                      <span className="text-xs font-bold block mb-1 text-[#0F7F84]">
                        🤖 Hydro-AI
                      </span>
                    )}
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div
                  className="flex justify-start"
                  data-ocid="ai.loading_state"
                >
                  <div className="bg-slate-100 rounded-2xl rounded-bl-sm p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="mt-3 flex flex-wrap gap-2">
            {AI_SUGGESTIONS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#22B8A6] text-[#0F7F84] hover:bg-[#22B8A6] hover:text-white transition-colors"
                data-ocid="ai.suggestion.button"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              data-ocid="ai.message.input"
              placeholder="Ask about your water system..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
            />
            <Button
              data-ocid="ai.send.button"
              style={{ background: "#0F7F84" }}
              onClick={() => send(input)}
              disabled={loading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Profile & Settings ───────────────────────────────────────────────────────
function ProfileSettings({
  user,
}: { user: { name: string; email: string; webId: string } }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [webId, setWebId] = useState(user.webId);
  const [phThreshold, setPhThreshold] = useState([7.5]);
  const [pressureThreshold, setPressureThreshold] = useState([30]);
  const [saving, setSaving] = useState(false);
  const { actor } = useActor();

  const save = async () => {
    setSaving(true);
    try {
      if (actor) {
        await actor.saveCallerUserProfile({
          displayName: name,
          customWebId: webId,
          email,
        });
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0B3F4A]">
        Profile &amp; Settings
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base text-[#0B3F4A]">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0F7F84] to-[#22B8A6] flex items-center justify-center text-white text-2xl font-bold">
                {name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-700">{name}</p>
                <p className="text-sm text-slate-500">{email}</p>
                <Badge
                  style={{ background: "#dcfce7", color: "#166534" }}
                  className="text-xs mt-1"
                >
                  Admin
                </Badge>
              </div>
            </div>
            <div>
              <Label>Display Name</Label>
              <Input
                data-ocid="profile.name.input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                data-ocid="profile.email.input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Web ID</Label>
              <Input
                data-ocid="profile.webid.input"
                value={webId}
                onChange={(e) => setWebId(e.target.value)}
                placeholder="your-custom-id"
              />
            </div>
            <Button
              data-ocid="profile.save.submit_button"
              onClick={save}
              disabled={saving}
              style={{ background: "#0F7F84" }}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base text-[#0B3F4A]">
                Alert Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Max pH Threshold</Label>
                  <span className="text-sm font-semibold text-[#0F7F84]">
                    {phThreshold[0]}
                  </span>
                </div>
                <Slider
                  data-ocid="profile.ph_threshold.input"
                  min={6}
                  max={9}
                  step={0.1}
                  value={phThreshold}
                  onValueChange={setPhThreshold}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Low Pressure Alert (psi)</Label>
                  <span className="text-sm font-semibold text-[#0F7F84]">
                    {pressureThreshold[0]}
                  </span>
                </div>
                <Slider
                  data-ocid="profile.pressure_threshold.input"
                  min={10}
                  max={100}
                  step={5}
                  value={pressureThreshold}
                  onValueChange={setPressureThreshold}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base text-[#0B3F4A]">
                Account Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Total Usage This Month", value: "4,240 L" },
                { label: "Alerts Acknowledged", value: "12" },
                { label: "Valves Managed", value: "6" },
                { label: "Service Bookings", value: "3" },
                { label: "Member Since", value: "Jan 2025" },
              ].map((s) => (
                <div key={s.label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{s.label}</span>
                  <span className="font-medium text-slate-700">{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    id: "monitor",
    label: "Water Monitor",
    icon: <Droplets className="h-4 w-4" />,
  },
  {
    id: "weather",
    label: "Weather & Rain",
    icon: <CloudRain className="h-4 w-4" />,
  },
  {
    id: "valves",
    label: "Valve Control",
    icon: <Sliders className="h-4 w-4" />,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart2 className="h-4 w-4" />,
  },
  { id: "alerts", label: "Alerts", icon: <Bell className="h-4 w-4" /> },
  { id: "services", label: "Services", icon: <Wrench className="h-4 w-4" /> },
  { id: "shop", label: "Shop", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "ai", label: "AI Assistant", icon: <Bot className="h-4 w-4" /> },
  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
];

function Sidebar({
  page,
  onNav,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: {
  page: Page;
  onNav: (p: Page) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div
          role="presentation"
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onCloseMobile}
          onKeyDown={onCloseMobile}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 flex flex-col transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
        style={{ background: "#0B3F4A" }}
      >
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <img
            src="/assets/uploads/chatgpt_image_mar_28_2026_07_53_09_pm-019d38d4-c150-7469-ab36-5a279995318e-1.png"
            alt="Hydro-Tech Logo"
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              Hydro-Tech
            </p>
            <p className="text-cyan-300 text-xs">Smart Water</p>
          </div>
          <button
            type="button"
            className="ml-auto text-white/60 md:hidden"
            onClick={onCloseMobile}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ScrollArea className="flex-1 py-2">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => {
                onNav(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                page === item.id
                  ? "bg-white/15 text-white font-medium border-r-2 border-[#22B8A6]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </ScrollArea>
        <button
          type="button"
          data-ocid="nav.logout.button"
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-4 text-sm text-white/60 hover:text-white border-t border-white/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
    </>
  );
}

// ─── Bottom Navigation (Mobile) ──────────────────────────────────────────────
const BOTTOM_NAV_PRIMARY: { id: Page; label: string; icon: React.ReactNode }[] =
  [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    { id: "monitor", label: "Monitor", icon: <Droplets className="h-5 w-5" /> },
    { id: "valves", label: "Valves", icon: <Sliders className="h-5 w-5" /> },
    { id: "alerts", label: "Alerts", icon: <Bell className="h-5 w-5" /> },
  ];

const MORE_NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  {
    id: "weather",
    label: "Weather & Rain",
    icon: <CloudRain className="h-5 w-5" />,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  { id: "shop", label: "Shop", icon: <ShoppingBag className="h-5 w-5" /> },
  { id: "services", label: "Services", icon: <Wrench className="h-5 w-5" /> },
  { id: "ai", label: "AI Assistant", icon: <Bot className="h-5 w-5" /> },
  { id: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
];

function BottomNav({
  page,
  onNav,
  hidden,
}: { page: Page; onNav: (p: Page) => void; hidden?: boolean }) {
  const [moreOpen, setMoreOpen] = useState(false);

  const handleMore = (p: Page) => {
    onNav(p);
    setMoreOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#0B3F4A] flex md:hidden border-t border-white/10 safe-bottom${hidden ? " hidden" : ""}`}
      >
        {BOTTOM_NAV_PRIMARY.map((item) => (
          <button
            key={item.id}
            type="button"
            data-ocid={`bottom_nav.${item.id}.button`}
            onClick={() => onNav(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors ${
              page === item.id ? "text-[#22B8A6]" : "text-white/60"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
        <button
          type="button"
          data-ocid="bottom_nav.more.button"
          onClick={() => setMoreOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors ${
            MORE_NAV_ITEMS.some((m) => m.id === page)
              ? "text-[#22B8A6]"
              : "text-white/60"
          }`}
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="pb-safe"
          data-ocid="bottom_nav.more.sheet"
        >
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[#0B3F4A]">More Pages</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3">
            {MORE_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                data-ocid={`bottom_nav.more.${item.id}.button`}
                onClick={() => handleMore(item.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors min-h-[80px] justify-center ${
                  page === item.id
                    ? "bg-[#0B3F4A] text-white border-[#0B3F4A]"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {item.icon}
                <span className="text-xs font-medium text-center leading-tight">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileComplete, setProfileComplete] = useState(
    () => !!localStorage.getItem("hydroProfileComplete"),
  );
  const [user, setUser] = useState({
    name: "Admin",
    email: "admin@hydrotech.io",
    webId: "hydro-main",
  });
  const [page, setPage] = useState<Page>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogin = (webId: string, name: string, email: string) => {
    setUser({ name, email, webId });
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setPage("dashboard");
  };

  const handleProfileComplete = (data: {
    name: string;
    phone: string;
    location: string;
  }) => {
    setUser((prev) => ({ ...prev, name: data.name }));
    localStorage.setItem("hydroProfileComplete", "true");
    setProfileComplete(true);
  };

  if (!loggedIn) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (!profileComplete) {
    return (
      <>
        <ProfileSetupPage
          onComplete={handleProfileComplete}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Toaster />
      <Sidebar
        page={page}
        onNav={setPage}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-4 py-3 flex items-center gap-3 md:hidden">
          <button
            type="button"
            data-ocid="nav.hamburger.button"
            onClick={() => setMobileOpen(true)}
            className="text-slate-600"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold text-[#0B3F4A]">Hydro-Tech</p>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {page === "dashboard" && <Dashboard onNav={setPage} />}
          {page === "monitor" && <WaterMonitor />}
          {page === "weather" && <WeatherRain />}
          {page === "valves" && <ValveControl />}
          {page === "analytics" && <Analytics />}
          {page === "alerts" && <Alerts />}
          {page === "services" && <Services />}
          {page === "shop" && <Shop />}
          {page === "ai" && <AIAssistant />}
          {page === "profile" && <ProfileSettings user={user} />}
        </main>
        <footer className="text-center py-3 text-xs text-slate-400 border-t bg-white">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[#0F7F84]"
          >
            caffeine.ai
          </a>
        </footer>
        <BottomNav page={page} onNav={setPage} hidden={mobileOpen} />
      </div>
    </div>
  );
}
