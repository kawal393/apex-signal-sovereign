// APEX Node Registry - Sovereign Signal Infrastructure

export type NodeStatus = 'live' | 'sealed' | 'dormant';

export interface ApexNode {
  id: string;
  name: string;
  status: NodeStatus;
  purpose: string;
  domain?: string; // Domain focus for display
  externalUrl?: string;
  description?: string;
  whatYouGet?: string[];
  whoItsFor?: string[];
}

export const APEX_NODES: ApexNode[] = [
  // ============ LIVE NODES ============
  {
    id: 'ndis-watchtower',
    name: 'APEX NDIS Watchtower',
    status: 'live',
    domain: 'Disability compliance & enforcement signals',
    purpose: 'Real-time provider compliance and pricing signal monitoring for NDIS operators.',
    externalUrl: 'https://kawal393.github.io/ndis-signal-board/',
    whatYouGet: [
      'Provider registration and compliance status signals',
      'Pricing band alerts and market positioning data',
      'Operational risk assessment against current regulatory state',
    ],
    whoItsFor: [
      'NDIS providers navigating compliance uncertainty',
      'Operators considering market entry or expansion',
      'Decision-makers facing regulatory pressure',
    ],
  },
  {
    id: 'corporate-translator',
    name: 'APEX Corporate Translator',
    status: 'live',
    domain: 'Policy, procurement & regulatory language decoding',
    purpose: 'Decode institutional language into operational reality.',
    externalUrl: 'https://kawal393.github.io/apex-corporate-translator/',
    whatYouGet: [
      'Plain-language translation of corporate announcements',
      'Hidden signal extraction from public filings',
      'Institutional intent mapping and dependency analysis',
    ],
    whoItsFor: [
      'Operators dealing with institutional counterparties',
      'Stakeholders requiring clarity on corporate positioning',
      'Decision-makers evaluating partnership or exit timing',
    ],
  },
  {
    id: 'ata-ledger',
    name: 'APEX-ATA Ledger',
    status: 'live',
    domain: 'Immutable verdict registry',
    purpose: 'Permanent record of signal events and system state changes.',
    externalUrl: 'https://kawal393.github.io/ompc-1/',
    whatYouGet: [
      'Immutable event timeline with timestamp verification',
      'Cross-referenced signal correlation mapping',
      'Historical pattern recognition for decision support',
    ],
    whoItsFor: [
      'Operators requiring auditable decision records',
      'Stakeholders building institutional memory',
      'Analysts tracking signal evolution over time',
    ],
  },
  {
    id: 'ghost-protocol',
    name: 'APEX Ghost Protocol',
    status: 'live',
    domain: 'Internal operating doctrine',
    purpose: 'Silent monitoring of entities and dependencies without direct engagement.',
    description: 'Disciplined observation, triage, and escalation infrastructure. Process-based verification only. No execution. No representation. No impersonation.',
    externalUrl: 'https://kawal393.github.io/-APEX-GHOST-PROTOCOL/',
    whatYouGet: [
      'Passive entity monitoring and change detection',
      'Dependency mapping without exposure',
      'Early warning signals on counterparty risk',
    ],
    whoItsFor: [
      'Operators monitoring competitors or counterparties',
      'Stakeholders tracking regulatory body movements',
      'Decision-makers requiring situational awareness',
    ],
  },
  
  // ============ SEALED NODES ============
  {
    id: 'grid-constraint',
    name: 'Grid Constraint + Large Load Watchtower',
    status: 'sealed',
    domain: 'Energy connection & REZ bottlenecks',
    purpose: 'Infrastructure capacity monitoring and constraint signal detection for energy-intensive operators.',
    description: 'Monitors grid stability, large load connection queues, and infrastructure bottleneck signals. Reserved for operators with significant energy exposure.',
  },
  {
    id: 'pharma-zombie',
    name: 'Pharma Zombie Detector',
    status: 'sealed',
    domain: 'Patent cliffs & regulatory contradictions',
    purpose: 'Identification of pharmaceutical entities exhibiting terminal operational patterns.',
    description: 'Pattern recognition for companies displaying late-stage decline signals despite continued market presence. Reserved for institutional operators.',
  },
  {
    id: 'ai-compliance-ompc',
    name: 'AI Compliance / OMPC Standard',
    status: 'sealed',
    domain: 'Model disclosures & accountability schemas',
    purpose: 'Operational model provenance and compliance verification for AI-integrated systems.',
    description: 'Framework for AI model accountability, disclosure requirements, and operational provenance tracking. Reserved for AI-dependent operators.',
  },
  {
    id: 'optionality-vault',
    name: 'Optionality Vault',
    status: 'sealed',
    domain: 'Strategic decision pathway mapping',
    purpose: 'Strategic option preservation and decision pathway mapping.',
    description: 'Framework for maintaining decision optionality under institutional pressure. Reserved for operators facing irreversible choice architecture.',
  },

  // ============ DORMANT NODES ============
  // Infrastructure reserved for future expansion
  {
    id: 'mining-land-vault',
    name: 'Mining & Land Constraint Vault',
    status: 'dormant',
    domain: 'Resource extraction & land access signals',
    purpose: 'Monitoring of mining approvals, land access constraints, and resource extraction bottlenecks.',
    description: 'Dormant Node — Infrastructure Reserved. Capacity allocated for future activation.',
  },
  {
    id: 'water-rights',
    name: 'Water Rights & Allocation Intelligence',
    status: 'dormant',
    domain: 'Water allocation & entitlement signals',
    purpose: 'Water rights monitoring, allocation tracking, and entitlement risk assessment.',
    description: 'Dormant Node — Infrastructure Reserved. Capacity allocated for future activation.',
  },
  {
    id: 'carbon-safeguard',
    name: 'Carbon & Safeguard Mechanism Watchtower',
    status: 'dormant',
    domain: 'Emissions compliance & carbon market signals',
    purpose: 'Carbon market monitoring, safeguard mechanism compliance, and emissions risk signals.',
    description: 'Dormant Node — Infrastructure Reserved. Capacity allocated for future activation.',
  },
  {
    id: 'infrastructure-transport',
    name: 'Infrastructure & Transport Approvals Monitor',
    status: 'dormant',
    domain: 'Major project approvals & corridor access',
    purpose: 'Tracking of infrastructure approvals, transport corridors, and major project dependencies.',
    description: 'Dormant Node — Infrastructure Reserved. Capacity allocated for future activation.',
  },
  {
    id: 'government-procurement',
    name: 'Government Procurement Signal Board',
    status: 'dormant',
    domain: 'Public tender & procurement intelligence',
    purpose: 'Government procurement monitoring, tender signals, and contract award tracking.',
    description: 'Dormant Node — Infrastructure Reserved. Capacity allocated for future activation.',
  },
  {
    id: 'film-media-greenlight',
    name: 'Film & Media Greenlight Authority',
    status: 'dormant',
    domain: 'Production approvals & funding signals',
    purpose: 'Film and media production signal monitoring, funding flows, and greenlight intelligence.',
    description: 'Dormant Node — Infrastructure Reserved. Capacity allocated for future activation.',
  },
  {
    id: 'biotech-therapeutics',
    name: 'Biotech & Advanced Therapeutics Signals',
    status: 'dormant',
    domain: 'Clinical trials & regulatory pathway signals',
    purpose: 'Biotech and therapeutics monitoring, clinical trial signals, and regulatory pathway intelligence.',
    description: 'Dormant Node — Infrastructure Reserved. Capacity allocated for future activation.',
  },
  {
    id: 'critical-minerals',
    name: 'Critical Minerals & Strategic Supply Chains',
    status: 'dormant',
    domain: 'Strategic resource & supply chain signals',
    purpose: 'Critical minerals monitoring, strategic supply chain intelligence, and dependency risk signals.',
    description: 'Dormant Node — Infrastructure Reserved. Capacity allocated for future activation.',
  },
];

export const getLiveNodes = () => APEX_NODES.filter(n => n.status === 'live');
export const getSealedNodes = () => APEX_NODES.filter(n => n.status === 'sealed');
export const getDormantNodes = () => APEX_NODES.filter(n => n.status === 'dormant');
export const getNodeById = (id: string) => APEX_NODES.find(n => n.id === id);
