# EcoTrace Knowledge Graph - Complete Feature Documentation

**Date**: October 29, 2025
**Status**: ✅ **FULLY ENHANCED WITH PROFESSIONAL NETWORK VISUALIZATION**

---

## 🎯 Overview

The EcoTrace Knowledge Graph has been transformed into a **professional network visualization platform** featuring custom node components, advanced filtering, multiple layout algorithms, interactive modals, real-time statistics, and comprehensive relationship mapping across companies, claims, evidence sources, and regulatory bodies.

---

## ✨ Major Features Added

### **1. Enhanced Header with Statistics** 🎨

**Features**:
- Large gradient background (primary-600 → primary-700 → secondary-600)
- SVG grid pattern overlay at 10% opacity
- Large title with Network icon (h-10 w-10)
- Subtitle describing visualization purpose
- **Two Statistics Cards**:
  - Total Nodes count
  - Total Connections count
- Glassmorphism cards with backdrop-blur

**Visual Design**:
```jsx
Background: gradient from-primary-600 via-primary-700 to-secondary-600
Pattern: SVG 40x40 grid
Cards: bg-white/20 backdrop-blur-sm rounded-xl
Text: 4xl bold numbers, sm descriptive labels
```

---

### **2. Six Statistics Cards** 📊

**Metrics Displayed**:
1. **Companies** - 5 nodes (green gradient icon)
2. **Verified Claims** - 6 claims (blue gradient icon)
3. **Pending Claims** - 2 claims (yellow gradient icon)
4. **Disputed Claims** - 1 claim (red gradient icon)
5. **Evidence Sources** - 12 sources (white with border icon)
6. **Regulatory Bodies** - 4 bodies (purple gradient icon)

**Visual Features**:
- 2/3/6 column responsive grid
- Icon badge with gradient background
- Large number display (text-2xl)
- Descriptive label (text-sm)
- Hover shadow animation
- Staggered entrance animation (delay: index * 0.05s)

---

### **3. Advanced Controls Bar** 🔍

**Search Functionality**:
- Real-time search input
- Search icon indicator
- Searches by: node label, node ID
- Instant filtering

**Filter by Type**:
- All Types
- Companies
- Claims
- Sources
- Regulatory

**Filter by Status**:
- All Status
- Verified
- Pending
- Disputed

**Layout Selector**:
- Default Layout (manual positioning)
- Hierarchical (tier-based)
- Circular (radial layout)
- Grid (5 columns)

**Action Buttons**:
1. **Apply Layout** - Applies selected layout algorithm
2. **Fit View** - Zooms to fit all nodes (800ms animation)
3. **Export** - Export graph data (ready for implementation)

**Design**:
- White background card
- Flex-wrap responsive layout
- All controls in one bar
- Primary/Secondary/Accent button colors
- Hover effects on all buttons

---

### **4. Custom Node Components** 🎴

#### **Company Node** (Type: company)

**Visual Design**:
```jsx
Background: gradient from-green-500 to-green-600
Border: 2px solid green-400
Shadow: shadow-lg
Padding: px-4 py-3
Min Width: 150px
```

**Content**:
- Building2 icon (h-5 w-5)
- Company name (font-bold)
- Credibility score (if available, text-xs opacity-90)

**Example**: Amazon - 84% credibility

---

#### **Claim Node** (Type: claim)

**Status-Based Colors**:
- **Verified**: Blue gradient (from-blue-500 to-blue-600)
- **Pending**: Yellow gradient (from-yellow-500 to-yellow-600)
- **Disputed**: Red gradient (from-red-500 to-red-600)

**Status Icons**:
- Verified: CheckCircle
- Pending: Clock
- Disputed: XCircle

**Content**:
- Status icon
- Claim text (text-xs font-semibold, max-w-220px)
- Confidence percentage (if available)

**Example**: "100% Renewable Energy 2025" - 92% confidence

---

#### **Source Node** (Type: source)

**Source Types & Icons**:
- **Report**: FileText icon (text-primary-600)
- **Scientific**: BookOpen icon (text-purple-600)
- **News**: Newspaper icon (text-blue-600)
- **Regulatory**: Scale icon (text-amber-600)

**Visual Design**:
```jsx
Background: white
Border: 2px solid gray-300
Hover Border: border-primary-400
Shadow: shadow-md
Min Width: 140px
```

**Content**:
- Type-specific icon
- Source name (text-xs font-medium)

**Example**: "Sustainability Report 2024", "IPCC Climate Study"

---

#### **Regulatory Node** (Type: regulatory)

**Visual Design**:
```jsx
Background: gradient from-purple-500 to-purple-600
Border: 2px solid purple-400
Shadow: shadow-lg
Min Width: 140px
```

**Content**:
- Shield icon (h-4 w-4)
- Organization name (text-xs font-bold)

**Example**: EPA, SEC, UN Climate, EU Commission

---

### **5. Enhanced Edge System** 🔗

#### **Edge Types & Styling**:

**Company → Claim** (Makes relationship):
```javascript
Style: stroke green (#10b981), width 2.5px, solid
Animated: true
Marker: ArrowClosed (green)
Label: "makes"
```

**Claim → Source** (Verification relationship):

- **Verified**:
  ```javascript
  Style: stroke blue (#3b82f6), width 2px, dashed (5,5)
  Marker: ArrowClosed (blue)
  Label: "verified by"
  ```

- **Pending**:
  ```javascript
  Style: stroke yellow (#f59e0b), width 2px, dashed (5,5)
  Marker: ArrowClosed (yellow)
  Label: "under review"
  ```

- **Disputed**:
  ```javascript
  Style: stroke red (#ef4444), width 2px, dashed (5,5)
  Marker: ArrowClosed (red)
  Label: "disputed"
  ```

**Source → Regulatory** (Oversight relationship):
```javascript
Style: stroke purple (#8b5cf6), width 1.5px, solid
Marker: ArrowClosed (purple)
```

**Default Options**:
- Type: smoothstep (curved edges)
- All edges have arrow markers

---

### **6. Interactive Network Visualization** 🌐

**Graph Configuration**:
- Height: 700px
- Background: Dots pattern (gap: 20, size: 1.5, color: #e5e7eb)
- Attribution: bottom-left
- FitView: Enabled on load

**Nodes Data**:
- **5 Companies**: Microsoft, Amazon, Google, Apple, Tesla
- **9 Claims**: Mixed verified/pending/disputed
- **12 Sources**: Reports, scientific, news, regulatory
- **4 Regulatory Bodies**: EPA, SEC, UN Climate, EU Commission
- **Total**: 30 nodes

**Edges Data**:
- **9 Company-Claim edges** (who makes what claim)
- **9 Claim-Source edges** (evidence verification)
- **4 Source-Regulatory edges** (oversight)
- **Total**: 25+ connections

---

### **7. MiniMap & Controls** 🗺️

**MiniMap Features**:
- Position: Default (bottom-right)
- Size: Responsive
- Node colors match type:
  - Companies: Green (#10b981)
  - Verified claims: Blue (#3b82f6)
  - Pending claims: Yellow (#f59e0b)
  - Disputed claims: Red (#ef4444)
  - Regulatory: Purple (#8b5cf6)
  - Others: Gray (#e5e7eb)
- Mask color: rgba(0,0,0,0.05)
- Style: White background, rounded-xl, shadow-lg

**Controls Widget**:
- Zoom in/out buttons
- Fit view button
- Interactive toggle (hidden)
- Style: White rounded-xl with border

---

### **8. Network Stats Panel** 📊

**Location**: Top-right overlay

**Statistics Shown**:
- Companies count
- Claims count
- Sources count
- Connections count (edges)

**Design**:
```jsx
Background: bg-white/90 backdrop-blur-sm
Style: rounded-xl shadow-lg p-4
Border: border-gray-200
Text: text-sm with font-bold header
Layout: 2-column flex (label | value)
```

**Updates**: Real-time as nodes/edges change

---

### **9. Node Details Modal** 🔍

**Trigger**: Click any node

**Modal Features**:

**Header**:
- Gradient background (primary-600 → secondary-600)
- "Node Details" title (text-2xl)
- Close button (X icon) in top-right
- Sticky positioning

**Content Sections**:

1. **Basic Info**:
   - Type-specific icon (large, h-8 w-8)
   - Node label (text-xl font-bold)
   - Node type badge

2. **Company Nodes**:
   - Credibility score display
   - Animated progress bar (green gradient)
   - Score percentage (text-2xl)

3. **Claim Nodes**:
   - Confidence level display
   - Animated progress bar (blue gradient)
   - Confidence percentage
   - Status badge (verified/pending/disputed)

4. **Technical Details**:
   - Node ID (font-mono)
   - Type (capitalized)
   - Position X coordinate
   - Position Y coordinate
   - 2-column grid layout
   - Gray background card

5. **Connections Analysis**:
   - Incoming connections count
   - Outgoing connections count
   - Large number display (text-2xl)
   - Primary-colored background
   - GitBranch icon

6. **Action Buttons**:
   - "View Full Details" (primary button)
   - "Related Nodes" (gray button)
   - Full width, side-by-side

**Animations**:
```javascript
Modal backdrop: opacity 0 → 1
Modal content: scale 0.9 → 1
Progress bars: width 0 → actual% (duration: 0.8s)
Exit: Reverse animations
```

**Interactivity**:
- Click backdrop to close
- Click X button to close
- Click inside modal: no close
- Max height: 80vh with scroll

---

### **10. Search & Filter System** 🔎

**Search Mechanism**:
```javascript
Filter: node.data.label.includes(query) || node.id.includes(query)
Case: Insensitive
Update: Real-time on input change
Effect: Hides non-matching nodes
```

**Type Filter**:
```javascript
Options: all, company, claim, source, regulatory
Effect: Shows only nodes of selected type
Combined: Works with search and status filters
```

**Status Filter**:
```javascript
Options: all, verified, pending, disputed
Applies to: Claim nodes only
Effect: Shows only claims with matching status
Combined: Works with search and type filters
```

**Filter Combination**:
- All filters use AND logic
- Hidden nodes updated in real-time
- Edges to hidden nodes remain visible
- Clear search → show all nodes

---

### **11. Layout Algorithms** 📐

#### **Default Layout**:
- Manual positioning as defined
- Allows custom arrangements
- Best for small graphs

#### **Hierarchical Layout**:
```javascript
Tier 1 (Companies): y=50, x=index*320
Tier 2 (Claims): y=300, x=(index-5)*160
Tier 3 (Sources): y=550, x=(index-14)*120
Tier 4 (Regulatory): y=750, x=(index-26)*300
```
- Top-down hierarchy
- Clear separation by type
- Best for understanding relationships

#### **Circular Layout**:
```javascript
Radius: 300px
Center: (600, 400)
Angle: (index/total) * 2π
Position: center + radius * (cos(angle), sin(angle))
```
- Even distribution around circle
- All nodes equal distance from center
- Best for dense graphs

#### **Grid Layout**:
```javascript
Columns: 5
X position: (index % 5) * 280 + 100
Y position: floor(index / 5) * 200 + 100
```
- Organized rows and columns
- Uniform spacing
- Best for comparison

**Apply Method**:
- Click "Apply Layout" button
- Nodes animate to new positions
- FitView called after 100ms delay
- Smooth transition (800ms duration)

---

### **12. Interactive Instructions** 📖

**Two Instruction Cards**:

#### **Interactive Controls** (Blue gradient):
- Click & Drag nodes
- Scroll or Pinch to zoom
- Click nodes for details
- Pan by dragging background
- Use filters to focus

#### **Edge Types** (Purple gradient):
- Green Solid: Company → Claim
- Blue Dashed: Verified evidence
- Yellow Dashed: Under review
- Red Dashed: Disputed
- Purple Solid: Regulatory oversight

**Design**:
- 2-column grid on desktop
- Gradient backgrounds (blue-50/cyan-50, purple-50/pink-50)
- 2px borders (blue-200, purple-200)
- Bullet points with colored dots
- Bold keywords
- Icon headers (Info, Target)

---

## 📊 Node & Edge Statistics

### **Node Breakdown**:
| Type | Count | Color | Icon |
|------|-------|-------|------|
| Companies | 5 | Green | Building2 |
| Claims (Verified) | 6 | Blue | CheckCircle |
| Claims (Pending) | 2 | Yellow | Clock |
| Claims (Disputed) | 1 | Red | XCircle |
| Sources | 12 | White | Type-specific |
| Regulatory | 4 | Purple | Shield |
| **Total** | **30** | - | - |

### **Edge Breakdown**:
| Relationship | Count | Style | Color |
|--------------|-------|-------|-------|
| Company → Claim | 9 | Solid, animated | Green |
| Claim → Source (Verified) | 9 | Dashed | Blue |
| Claim → Source (Pending) | 2 | Dashed | Yellow |
| Claim → Source (Disputed) | 1 | Dashed | Red |
| Source → Regulatory | 4 | Solid | Purple |
| **Total** | **25** | - | - |

---

## 🎨 Design System

### **Color Palette**:

#### **Node Colors**:
```javascript
Company: from-green-500 to-green-600 (border: green-400)
Claim Verified: from-blue-500 to-blue-600 (border: blue-400)
Claim Pending: from-yellow-500 to-yellow-600 (border: yellow-400)
Claim Disputed: from-red-500 to-red-600 (border: red-400)
Source: white (border: gray-300, hover: primary-400)
Regulatory: from-purple-500 to-purple-600 (border: purple-400)
```

#### **Edge Colors**:
```javascript
Makes: #10b981 (green)
Verified: #3b82f6 (blue)
Pending: #f59e0b (yellow)
Disputed: #ef4444 (red)
Oversight: #8b5cf6 (purple)
```

---

### **Typography**:
```javascript
Header Title: text-4xl font-display font-bold
Header Subtitle: text-lg text-primary-100
Stat Numbers: text-4xl font-bold (header), text-2xl (cards)
Stat Labels: text-sm text-primary-100/gray-600
Company Names: text-sm font-bold
Claim Text: text-xs font-semibold
Modal Title: text-2xl font-bold
Modal Content: text-xl font-bold (name), text-sm (labels)
```

---

### **Spacing & Layout**:
```javascript
Container: space-y-6
Header: p-8
Stats Grid: gap-4, p-4
Controls Bar: gap-4, p-4
Graph Height: 700px
Modal Max Width: 2xl
Modal Max Height: 80vh
Card Padding: p-4 to p-6
Border Radius: rounded-xl (large), rounded-lg (medium)
```

---

## 🎯 User Interactions

### **Drag & Drop**:
- Click and hold any node
- Drag to new position
- Drop to place
- Position saves in state
- Other connected nodes stay in place

### **Zoom & Pan**:
- **Scroll**: Zoom in/out
- **Pinch**: Mobile zoom
- **Control buttons**: Zoom in/out
- **Drag background**: Pan view
- **Fit View button**: Auto-zoom to show all

### **Node Selection**:
- Click any node
- Modal appears instantly
- Shows all node data
- Progress bars animate
- Click backdrop or X to close

### **Search**:
- Type in search box
- Instant filtering
- Matches label or ID
- Case insensitive
- Clear to reset

### **Filtering**:
- Select type dropdown
- Select status dropdown
- Nodes hide/show instantly
- Combines with search
- "All" to reset

### **Layout Change**:
- Select layout mode
- Click "Apply Layout"
- Nodes animate to positions
- View auto-fits
- Smooth transitions

---

## 📱 Responsive Design

### **Breakpoints**:

**Mobile** (< 640px):
- Header: Stack title and stats vertically
- Stats grid: 2 columns
- Controls: Full width, wrap to multiple rows
- Search: Full width
- Graph: Full width, 600px height
- Modal: Full width, padding reduced
- Instructions: 1 column

**Tablet** (640px - 1024px):
- Stats grid: 3 columns
- Controls: 2-3 per row
- Graph: 650px height
- Instructions: 2 columns

**Desktop** (> 1024px):
- Header: Side-by-side layout
- Stats grid: 6 columns
- Controls: All in one row
- Graph: 700px height
- Instructions: 2 columns
- Modal: Max 2xl width

---

## 🚀 Performance Optimizations

### **React Performance**:
```javascript
useCallback: onConnect, onNodeClick, handleAutoLayout
useMemo: stats, filteredNodes, legend
useNodesState: Built-in optimization
useEdgesState: Built-in optimization
ReactFlowProvider: Context optimization
```

### **Rendering**:
- Custom node components (4 types)
- Only visible nodes rendered
- Hidden nodes: `hidden: true` (not removed)
- Edges render even if node hidden
- Background dots cached

### **Animations**:
- Framer Motion AnimatePresence
- Staggered entrance (0.05s delay)
- Modal: scale + opacity
- Progress bars: width animation
- FitView: 800ms smooth transition

---

## 🔧 Technical Implementation

### **Dependencies**:
```json
{
  "reactflow": "^11.x",           // Graph visualization
  "framer-motion": "^10.16.16",   // Animations & modal
  "lucide-react": "latest",       // Icons (20+ types)
}
```

### **React Flow Features Used**:
- `useNodesState`: Node state management
- `useEdgesState`: Edge state management
- `useReactFlow`: fitView access
- `ReactFlowProvider`: Context wrapper
- `MiniMap`: Overview navigation
- `Controls`: Zoom controls
- `Background`: Dot pattern
- `Panel`: Stats overlay
- `MarkerType`: Arrow markers
- Custom node types

### **State Management**:
```javascript
nodes: Array of node objects
edges: Array of edge objects
selectedNode: Node object | null
searchQuery: string
filterStatus: 'all' | 'verified' | 'pending' | 'disputed'
filterType: 'all' | 'company' | 'claim' | 'source' | 'regulatory'
layoutMode: 'default' | 'hierarchical' | 'circular' | 'grid'
```

### **File Structure**:
```jsx
KnowledgeGraph.jsx
├── Custom Node Components
│   ├── CompanyNode
│   ├── ClaimNode
│   ├── SourceNode
│   └── RegulatoryNode
├── Data Generators
│   ├── generateNodes()
│   └── generateEdges()
├── KnowledgeGraphContent (Main Component)
│   ├── Header
│   ├── Statistics Cards
│   ├── Controls Bar
│   ├── ReactFlow Graph
│   │   ├── Background
│   │   ├── Controls
│   │   ├── MiniMap
│   │   └── Stats Panel
│   ├── Node Details Modal
│   └── Instructions Cards
└── KnowledgeGraph (Provider Wrapper)
```

---

## 📈 Data Relationships

### **Company Relationships**:

**Microsoft**:
- → Claim: "100% Renewable Energy 2025"

**Amazon**:
- → Claim: "Carbon Neutral by 2030"
- → Claim: "Water Conservation 40%"

**Google**:
- → Claim: "Net Zero Supply Chain"
- → Claim: "Biodiversity Protection"

**Apple**:
- → Claim: "Zero Waste Operations"
- → Claim: "Circular Economy Model"

**Tesla**:
- → Claim: "50% Emission Reduction"
- → Claim: "Sustainable Sourcing"

### **Claim Verification**:

**Verified Claims** (6):
- 100% Renewable Energy → Sustainability Report, IPCC Study
- Carbon Neutral → Reuters News, SEC Filing
- Zero Waste → EPA Report, Nature Journal
- Water Conservation → Environmental Report
- Circular Economy → Bloomberg Analysis
- Sustainable Sourcing → ESG Disclosure

**Pending Claims** (2):
- Net Zero Supply Chain → GHG Protocol (under review)
- Biodiversity Protection → MIT Research (under review)

**Disputed Claims** (1):
- 50% Emission Reduction → UN Climate Report (disputed)

### **Regulatory Oversight**:
- EPA ← EPA Compliance Report
- SEC ← SEC 10-K Filing
- UN Climate ← GHG Protocol, UN Climate Report
- EU Commission ← (pending connections)

---

## 💡 Advanced Features

### **1. Real-Time Statistics**:
- Calculates on every node/edge change
- Uses useMemo for performance
- Updates all displays automatically
- Shows in header and panel

### **2. Dynamic Filtering**:
- Multiple filter types combined
- Real-time visibility updates
- Preserves edge connections
- Smooth hide/show transitions

### **3. Layout Algorithms**:
- 4 different layouts
- Mathematical positioning
- Animated transitions
- Auto-fit after layout

### **4. Custom Node Rendering**:
- Type-specific components
- Gradient backgrounds
- Dynamic icon selection
- Conditional data display

### **5. Interactive Modal**:
- Detailed node information
- Animated progress bars
- Connection analysis
- Action buttons

### **6. Network Analysis**:
- Incoming/outgoing edge count
- Node type statistics
- Connection strength (width)
- Relationship types (colors)

---

## 🎯 Use Cases

### **For Analysts**:
- Visualize company-claim relationships
- Track evidence verification status
- Identify disputed claims quickly
- Understand regulatory oversight

### **For Researchers**:
- Explore knowledge network structure
- Find evidence sources for claims
- Compare company performance
- Analyze verification patterns

### **For Executives**:
- Quick overview of all claims
- Status at a glance (colors)
- Company credibility scores
- Network health metrics

### **For Auditors**:
- Trace claim to evidence
- Verify regulatory compliance
- Identify missing connections
- Flag disputed items

---

## 📊 Visual Examples

### **Company Node**:
```
┌─────────────────────────┐
│ 🏢 Amazon               │
│ 84% credibility         │
└─────────────────────────┘
(Green gradient, rounded-xl, shadow-lg)
```

### **Verified Claim Node**:
```
┌──────────────────────────┐
│ ✅ Carbon Neutral 2030   │
│ 88% confidence           │
└──────────────────────────┘
(Blue gradient, rounded-lg)
```

### **Source Node**:
```
┌────────────────────────┐
│ 📄 SEC 10-K Filing     │
└────────────────────────┘
(White, border-gray-300)
```

### **Edge Legend**:
```
Company ──────────────> Claim (Green, solid, animated)
Claim - - - - - - - - > Source (Blue, dashed, verified)
Claim - - - - - - - - > Source (Yellow, dashed, pending)
Claim - - - - - - - - > Source (Red, dashed, disputed)
Source ───────────────> Regulatory (Purple, solid)
```

---

## ✅ Completion Checklist

- [x] Custom company node component with credibility scores
- [x] Custom claim node component with status colors
- [x] Custom source node component with type icons
- [x] Custom regulatory node component
- [x] 30 nodes with detailed data
- [x] 25+ edges with typed relationships
- [x] Enhanced header with gradient and stats
- [x] 6 statistics cards with counts
- [x] Search functionality
- [x] Type filter dropdown
- [x] Status filter dropdown
- [x] Layout mode selector (4 modes)
- [x] Apply layout algorithm
- [x] Fit view button
- [x] Export button (ready)
- [x] Network stats panel overlay
- [x] MiniMap with color coding
- [x] Zoom controls widget
- [x] Node click modal with details
- [x] Animated progress bars
- [x] Connection analysis
- [x] Two instruction cards
- [x] Edge type legend
- [x] Responsive design
- [x] Hover effects
- [x] Smooth animations
- [x] Real-time filtering

---

## 🎉 Result Summary

The Knowledge Graph now features:

✅ **4 Custom Node Types** - Professional styled components
✅ **30 Nodes** - Companies, claims, sources, regulatory
✅ **25+ Connections** - Typed, colored, animated edges
✅ **Advanced Filtering** - Search, type, status filters
✅ **4 Layout Algorithms** - Default, hierarchical, circular, grid
✅ **Interactive Modal** - Detailed node information
✅ **Real-Time Stats** - Dynamic network metrics
✅ **MiniMap** - Color-coded overview navigation
✅ **Drag & Drop** - Repositionable nodes
✅ **Professional Design** - Gradients, shadows, animations
✅ **Responsive** - Mobile, tablet, desktop optimized

**The Knowledge Graph is now a professional-grade network visualization platform for sustainability claim analysis!**

---

## 📞 Access

**URL**: http://localhost:5173/knowledge-graph

**Navigation**: Click "Knowledge Graph" in sidebar

---

## 🔍 Example Queries

### **Find all verified claims**:
1. Set Status filter to "Verified"
2. See 6 blue nodes highlighted
3. Trace evidence sources

### **Explore Amazon's claims**:
1. Search for "Amazon"
2. Click company node
3. View modal details
4. See 2 outgoing connections

### **Check disputed claims**:
1. Set Status filter to "Disputed"
2. See 1 red node (Tesla's claim)
3. Follow red dashed edge to evidence

### **Analyze regulatory oversight**:
1. Set Type filter to "Regulatory"
2. See 4 purple nodes
3. Trace purple edges to sources

---

## 🚀 Future Enhancements (Optional)

### **Phase 2 Features**:
1. **Force-Directed Layout**: Physics-based auto-layout
2. **Timeline Filtering**: Filter by claim date
3. **Cluster Analysis**: Auto-group related nodes
4. **Path Finding**: Shortest path between nodes
5. **Export Graph**: PNG/SVG/JSON download
6. **Node Editing**: Add/remove/edit nodes
7. **Edge Weights**: Connection strength visualization
8. **3D Visualization**: Three.js integration
9. **Real-Time Updates**: WebSocket live data
10. **Collaborative Editing**: Multi-user support

### **Advanced Visualizations**:
- Heat map of connection density
- Temporal evolution animation
- Sub-graph extraction
- Community detection
- Centrality analysis
- Influence propagation

---

**Made with ❤️ for transparent sustainability networks**

*Knowledge Graph Enhanced on October 29, 2025*
