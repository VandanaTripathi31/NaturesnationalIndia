"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderTree,
  Package,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  Settings,
  Activity,
  Eye,
} from "lucide-react";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";

// ── Skeleton ──────────────────────────────────────────────────────────────
function Sk({ w = "w-20", h = "h-6" }: { w?: string; h?: string }) {
  return <div className={`skeleton ${w} ${h} rounded-lg`} />;
}

// ── Sparkline ─────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 80, h = 36;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h * 0.8 - h * 0.1;
      return `${x},${y}`;
    })
    .join(" ");
  const fillPath = `M0,${h} L${pts.split(" ").join(" L")} L${w},${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <path d={fillPath} fill={`${color}22`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Donut ─────────────────────────────────────────────────────────────────
function Donut({ pct, color, size = 70, stroke = 10 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-strong)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dasharray 1s ease" }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        fill="var(--text-primary)"
        style={{ fontSize: 13, fontWeight: 800 }}>{pct}%</text>
    </svg>
  );
}

// ── LineChart ─────────────────────────────────────────────────────────────
function LineChart({ series }: { series: { data: number[]; color: string }[] }) {
  const allVals = series.flatMap((s) => s.data);
  const max = Math.max(...allVals);
  const min = Math.min(...allVals);
  const W = 320, H = 90;
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {series.map((s, si) => {
        const pts = s.data
          .map((v, i) => {
            const x = (i / (s.data.length - 1)) * W;
            const y = H - ((v - min) / (max - min || 1)) * H * 0.85 - H * 0.07;
            return `${x},${y}`;
          })
          .join(" ");
        return <polyline key={si} points={pts} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />;
      })}
    </svg>
  );
}

// ── BarChart ──────────────────────────────────────────────────────────────
function BarChart({ data, highlight }: { data: number[]; highlight: number }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 110, width: "100%" }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.1 + i * 0.04, duration: 0.45, ease: "easeOut" }}
          style={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            transformOrigin: "bottom",
            borderRadius: "4px 4px 0 0",
            background: i === highlight ? "#2F8D6E" : "rgba(47,141,110,0.15)",
          }}
        />
      ))}
    </div>
  );
}

// ── Static data ───────────────────────────────────────────────────────────
const recentActivity = [
  { icon: CheckCircle2, color: "#2F8D6E", bg: "rgba(47,141,110,0.12)", text: "Order #1042 fulfilled", time: "2m ago" },
  { icon: AlertCircle, color: "#f59e0b", bg: "rgba(245,158,11,0.12)", text: "Low stock: Coconut Oil", time: "18m ago" },
  { icon: Truck, color: "#6366f1", bg: "rgba(99,102,241,0.12)", text: "Shipment dispatched #1039", time: "1h ago" },
  { icon: Package, color: "#ec4899", bg: "rgba(236,72,153,0.12)", text: "Neem Hair Oil published", time: "3h ago" },
];
const topProducts = ["Cold-Press Coconut Oil", "Neem Hair Oil", "Rosehip Serum"];
const topBuyers = ["Priya Sharma", "Rahul Verma", "Neha Singh"];
const barData = [38, 55, 42, 70, 58, 85, 65, 78, 52, 90, 60, 74];
const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const sparkA = [20, 35, 28, 50, 40, 65, 55, 70];
const sparkB = [60, 45, 70, 55, 80, 65, 75, 90];
const sparkC = [30, 50, 40, 60, 45, 70, 55, 80];

// ── Card wrapper using CSS vars ───────────────────────────────────────────
function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`admin-card rounded-[20px] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// ── Section eyebrow ───────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
      {children}
    </p>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, categories: 0, published: 0, orders: 12 });

  useEffect(() => {
    Promise.all([productService.list({ limit: 1 }), categoryService.list({ limit: 1 })])
      .then(([p, c]) =>
        setStats((s) => ({
          ...s,
          products: p.pagination.total,
          categories: c.pagination.total,
          published: Math.floor(p.pagination.total * 0.8),
        }))
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ══ ROW 1 — Stat cards ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {[
          { label: "Total Categories", value: stats.categories, icon: FolderTree, spark: sparkA, color: "#2F8D6E", pct: "+12%" },
          { label: "Total Products", value: stats.products, icon: Package, spark: sparkB, color: "#6366f1", pct: "+8%" },
          { label: "Active Orders", value: stats.orders, icon: ShoppingBag, spark: sparkC, color: "#f59e0b", pct: "12 pending" },
          { label: "Published", value: stats.published, icon: TrendingUp, spark: sparkA, color: "#ec4899", pct: "Live" },
        ].map(({ label, value, icon: Icon, spark, color, pct }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card style={{ padding: "20px 20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: `${color}1a`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon style={{ width: 17, height: 17, color }} strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, padding: "3px 8px", borderRadius: 100 }}>{pct}</span>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</p>
                {loading
                  ? <Sk h="h-8" w="w-16" />
                  : <p style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</p>
                }
              </div>
              <Sparkline data={spark} color={color} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ══ ROW 2 — Bar chart + Visitors ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card style={{ padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <Eyebrow>Analytics</Eyebrow>
                <p style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Monthly Sales Overview</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2F8D6E" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#2F8D6E" }}>6 Months</span>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: "30%", left: 0, right: 0, borderTop: "1.5px dashed rgba(245,158,11,0.40)", zIndex: 1, pointerEvents: "none" }} />
              <BarChart data={barData} highlight={9} />
            </div>
            <div style={{ display: "flex", marginTop: 6 }}>
              {months.map((m, i) => (
                <span key={i} style={{ flex: 1, fontSize: 9, textAlign: "center", color: "var(--text-muted)", fontWeight: 600 }}>{m}</span>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
          <Card style={{ padding: "18px 20px", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <Eye style={{ width: 14, height: 14, color: "#2F8D6E" }} />
              <Eyebrow>Visitors</Eyebrow>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              {[
                { label: "Unique", value: "12.9K", up: true },
                { label: "Bounce", value: "65%", up: false },
                { label: "Total", value: "212.5K", up: true },
                { label: "Avg. Time", value: "1m 45s", up: true },
              ].map(({ label, value, up }) => (
                <div key={label}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{value}</p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 3, marginTop: 2,
                    background: up ? "rgba(47,141,110,0.12)" : "rgba(239,68,68,0.12)",
                    padding: "2px 6px", borderRadius: 100,
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: up ? "#2F8D6E" : "#ef4444" }}>{up ? "▲" : "▼"}</span>
                  </div>
                </div>
              ))}
            </div>
            <LineChart series={[
              { data: [30, 50, 40, 70, 55, 80, 65, 90, 70, 95], color: "#2F8D6E" },
              { data: [20, 35, 55, 45, 65, 50, 75, 60, 80, 70], color: "var(--border-strong)" },
            ]} />
          </Card>
        </motion.div>
      </div>

      {/* ══ ROW 3 — Donut + Revenue ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
          <Card style={{ padding: "20px 24px" }}>
            <Eyebrow>Performance</Eyebrow>
            <CardTitle>Key Metrics</CardTitle>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", marginTop: 18 }}>
              {[
                { label: "Fulfillment", pct: 85, color: "#2F8D6E" },
                { label: "Satisfaction", pct: 46, color: "#6366f1" },
                { label: "Return Rate", pct: 92, color: "#f59e0b" },
              ].map(({ label, pct, color }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <Donut pct={pct} color={color} size={74} stroke={9} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", textAlign: "center" }}>{label}</p>
                  <p style={{ fontSize: 10, fontWeight: 700, color, background: `${color}14`, padding: "2px 8px", borderRadius: 100 }}>{pct}%</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
          <Card style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <Eyebrow>Revenue</Eyebrow>
                <CardTitle>Growth Trend</CardTitle>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#2F8D6E", letterSpacing: "-0.02em" }}>₹2.4L</p>
                <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)" }}>This month</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              {[
                { label: "330", sub: "New orders", color: "#2F8D6E" },
                { label: "2", sub: "Refunds", color: "#ef4444" },
                { label: "1566", sub: "Revenue ₹K", color: "#6366f1" },
              ].map(({ label, sub, color }) => (
                <div key={sub} style={{ flex: 1, background: "var(--surface-muted)", borderRadius: 12, padding: "10px 12px" }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: "-0.02em" }}>{label}</p>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>{sub}</p>
                </div>
              ))}
            </div>
            <LineChart series={[
              { data: [20, 45, 30, 60, 40, 80, 55, 75, 50, 90, 65, 85], color: "#2F8D6E" },
              { data: [40, 30, 50, 35, 60, 45, 70, 55, 65, 50, 75, 60], color: "var(--border-strong)" },
            ]} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {["Oct", "Nov", "Dec"].map((m) => (
                <span key={m} style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>{m}</span>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ══ ROW 4 — Activity + Products + Buyers ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}>
          <Card style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <Eyebrow>Latest</Eyebrow>
                <CardTitle>Recent Activity</CardTitle>
              </div>
              <Link href="/admin/orders" style={{ fontSize: 11, fontWeight: 700, color: "#2F8D6E", textDecoration: "none" }}>View all →</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentActivity.map(({ icon: Icon, color, bg, text, time }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 0",
                    borderBottom: i < recentActivity.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: 14, height: 14, color }} strokeWidth={2} />
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, flex: 1, lineHeight: 1.4 }}>{text}</p>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0, fontWeight: 500 }}>{time}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Top Products + Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}>
          <Card style={{ padding: "20px" }}>
            <Eyebrow>Catalogue</Eyebrow>
            <CardTitle>Top Products</CardTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
              {topProducts.map((name, i) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(47,141,110,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#2F8D6E" }}>{i + 1}</span>
                  </div>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)", flex: 1 }}>{name}</p>
                  <ArrowUpRight style={{ width: 13, height: 13, color: "#2F8D6E", opacity: 0.5 }} />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <Eyebrow>Quick Actions</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {[
                  { href: "/admin/products/new", label: "Add Product", icon: Plus },
                  { href: "/admin/orders", label: "View Orders", icon: ShoppingBag },
                  { href: "/admin/settings", label: "Settings", icon: Settings },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 10px", borderRadius: 10,
                      background: "var(--surface-muted)",
                      textDecoration: "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(47,141,110,0.10)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface-muted)")}
                  >
                    <Icon style={{ width: 13, height: 13, color: "#2F8D6E" }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Top Buyers */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}>
          <Card style={{ padding: "20px" }}>
            <Eyebrow>Customers</Eyebrow>
            <CardTitle>Top Buyers</CardTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
              {topBuyers.map((name, i) => {
                const colors = ["#2F8D6E", "#6366f1", "#f59e0b"];
                const amounts = ["₹8,240", "₹6,180", "₹4,920"];
                return (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${colors[i]}1a`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: colors[i] }}>{name[0]}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)", margin: 0 }}>{name}</p>
                      <p style={{ fontSize: 10, color: "var(--text-muted)", margin: 0 }}>#{1040 + i} • 3 orders</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: colors[i] }}>{amounts[i]}</span>
                  </div>
                );
              })}
            </div>

            {/* Revenue banner */}
            <div style={{ marginTop: 20, padding: "14px", background: "linear-gradient(135deg, #2F8D6E 0%, #1a5c45 100%)", borderRadius: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Total Revenue</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>₹2,40,000</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <Activity style={{ width: 12, height: 12, color: "rgba(255,255,255,0.70)" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>+18% from last month</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

    </div>
  );
}
